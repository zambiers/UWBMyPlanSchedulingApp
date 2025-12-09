const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const rootDir = path.resolve(__dirname, '..');
const dbPath = process.env.SQLITE_DB_PATH
  ? path.resolve(rootDir, process.env.SQLITE_DB_PATH)
  : path.join(rootDir, 'data', 'local-sqlite.db');
const resetOnStart = String(process.env.SQLITE_RESET || '').toLowerCase() === 'true';
const port = Number(process.env.API_PORT) || 4000;

const schemaFile = path.join(rootDir, 'src', 'database', 'courseScheduler.session.sql');
const dataFile = path.join(rootDir, 'src', 'database', 'dataInsertion.sql');
const allowedTables = [
  'students',
  'professors',
  'courses',
  'section',
  'degreeprogram',
  'studentsection',
  'studentdegreeprogram',
];

function runInTransaction(db, fn) {
  const trx = db.transaction(fn);
  return trx();
}

function prepareDatabase() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (resetOnStart && fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  if (fs.existsSync(dbPath) && !resetOnStart) {
    console.log(`[sqlite] Using existing database at ${dbPath}`);
    return;
  }

  const db = new Database(dbPath);
  const schemaSql = fs.readFileSync(schemaFile, 'utf8');
  const dataSql = fs.readFileSync(dataFile, 'utf8');

  db.exec(schemaSql);
  db.exec(dataSql);
  db.close();
  console.log(`[sqlite] Database ready at ${dbPath}${resetOnStart ? ' (recreated)' : ''}`);
}

prepareDatabase();

const db = new Database(dbPath, { readonly: false });
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbPath, resetOnStart });
});

// Course search with optional major/keyword
app.get('/api/courses/search', (req, res) => {
  const major = req.query.major ? String(req.query.major) : null;
  const keyword = req.query.keyword ? String(req.query.keyword) : null;

  const where = [];
  const params = [];

  if (major) {
    where.push('Major = ?');
    params.push(major);
  }
  if (keyword) {
    where.push('(CourseName LIKE ? OR Description LIKE ?)');
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  try {
    const rows = db.prepare(`SELECT * FROM Courses ${whereSql}`).all(...params);
    res.json(rows);
  } catch (error) {
    console.error('[sqlite] course search failed', error);
    res.status(500).json({ error: 'Failed to search courses' });
  }
});

// Sections for a single course (includes seats available)
app.get('/api/courses/:courseCode/sections', (req, res) => {
  const courseCode = String(req.params.courseCode || '').trim();
  if (!courseCode) {
    res.status(400).json({ error: 'CourseCode is required' });
    return;
  }

  try {
    const rows = db
      .prepare(
        `
        SELECT CourseCode,
               SectionLetter,
               MeetingDay,
               StartTime,
               EndTime,
               RoomNum,
               Instructor,
               MaxEnrolled,
               EnrolledStudents,
               (MaxEnrolled - EnrolledStudents) AS SeatsAvailable
        FROM Section
        WHERE CourseCode = ?
        ORDER BY MeetingDay, StartTime;
      `,
      )
      .all(courseCode);
    res.json(rows);
  } catch (error) {
    console.error('[sqlite] course sections failed', error);
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
});

// Student schedule (sample query 1)
app.get('/api/students/:studentId/schedule', (req, res) => {
  const studentId = Number(req.params.studentId);
  if (Number.isNaN(studentId)) {
    res.status(400).json({ error: 'Invalid student id' });
    return;
  }

  try {
    const rows = db
      .prepare(
        `
        SELECT st.StudentID,
               st.FirstName || ' ' || st.LastName AS StudentName,
               c.CourseCode,
               c.CourseName,
               se.SectionLetter,
               se.MeetingDay,
               se.StartTime,
               se.EndTime,
               se.RoomNum,
               p.FirstName || ' ' || p.LastName AS InstructorName,
               ss.Grade
        FROM StudentSection ss
        JOIN Students st ON ss.StudentID = st.StudentID
        JOIN Section se ON ss.CourseCode = se.CourseCode
                       AND ss.SectionLetter = se.SectionLetter
                       AND ss.MeetingDay = se.MeetingDay
                       AND ss.StartTime = se.StartTime
        JOIN Courses c ON se.CourseCode = c.CourseCode
        LEFT JOIN Professors p ON se.Instructor = p.EmployeeID
        WHERE st.StudentID = ?
        ORDER BY se.MeetingDay, se.StartTime;
      `,
      )
      .all(studentId);
    res.json(rows);
  } catch (error) {
    console.error('[sqlite] schedule query failed', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Open sections not already enrolled (sample query 5)
app.get('/api/open-sections', (req, res) => {
  const studentId = Number(req.query.studentId);
  const major = String(req.query.major || '').trim();
  if (!major) {
    res.status(400).json({ error: 'Major is required' });
    return;
  }
  if (Number.isNaN(studentId)) {
    res.status(400).json({ error: 'Invalid student id' });
    return;
  }

  try {
    const rows = db
      .prepare(
        `
        SELECT se.CourseCode,
               c.CourseName,
               se.SectionLetter,
               se.MeetingDay,
               se.StartTime,
               se.EndTime,
               (se.MaxEnrolled - se.EnrolledStudents) AS SeatsAvailable
        FROM Section se
        JOIN Courses c ON se.CourseCode = c.CourseCode
        WHERE c.Major = ?
          AND se.EnrolledStudents < se.MaxEnrolled
          AND se.CourseCode NOT IN (
            SELECT ss.CourseCode
            FROM StudentSection ss
            WHERE ss.StudentID = ?
          )
        ORDER BY c.CourseCode, se.MeetingDay, se.StartTime;
      `,
      )
      .all(major, studentId);
    res.json(rows);
  } catch (error) {
    console.error('[sqlite] open-sections failed', error);
    res.status(500).json({ error: 'Failed to fetch open sections' });
  }
});

// Enroll with capacity check
app.post('/api/enroll', (req, res) => {
  const { studentId, courseCode, sectionLetter, meetingDay, startTime } = req.body || {};
  if (!studentId || !courseCode || !sectionLetter || !meetingDay || !startTime) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const result = runInTransaction(db, () => {
      const section = db
        .prepare(
          `
          SELECT MaxEnrolled, EnrolledStudents
          FROM Section
          WHERE CourseCode = ? AND SectionLetter = ? AND MeetingDay = ? AND StartTime = ?
        `,
        )
        .get(courseCode, sectionLetter, meetingDay, startTime);

      if (!section) {
        throw new Error('Section not found');
      }
      if (section.EnrolledStudents >= section.MaxEnrolled) {
        throw new Error('Section is full');
      }

      const already = db
        .prepare(
          `
          SELECT 1 FROM StudentSection
          WHERE StudentID = ? AND CourseCode = ? AND SectionLetter = ? AND MeetingDay = ? AND StartTime = ?
        `,
        )
        .get(studentId, courseCode, sectionLetter, meetingDay, startTime);
      if (already) {
        throw new Error('Already enrolled');
      }

      db.prepare(
        `
        INSERT INTO StudentSection (StudentID, CourseCode, SectionLetter, MeetingDay, StartTime, Grade)
        VALUES (?, ?, ?, ?, ?, NULL)
      `,
      ).run(studentId, courseCode, sectionLetter, meetingDay, startTime);

      db.prepare(
        `
        UPDATE Section
        SET EnrolledStudents = EnrolledStudents + 1
        WHERE CourseCode = ? AND SectionLetter = ? AND MeetingDay = ? AND StartTime = ?
      `,
      ).run(courseCode, sectionLetter, meetingDay, startTime);

      return { ok: true };
    });

    res.json(result);
  } catch (error) {
    console.error('[sqlite] enroll failed', error);
    res.status(400).json({ error: error.message || 'Enroll failed' });
  }
});

// Drop enrollment
app.delete('/api/enroll', (req, res) => {
  const { studentId, courseCode, sectionLetter, meetingDay, startTime } = req.body || {};
  if (!studentId || !courseCode || !sectionLetter || !meetingDay || !startTime) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const result = runInTransaction(db, () => {
      const deleted = db
        .prepare(
          `
          DELETE FROM StudentSection
          WHERE StudentID = ? AND CourseCode = ? AND SectionLetter = ? AND MeetingDay = ? AND StartTime = ?
        `,
        )
        .run(studentId, courseCode, sectionLetter, meetingDay, startTime);

      if (deleted.changes === 0) {
        throw new Error('Enrollment not found');
      }

      db.prepare(
        `
        UPDATE Section
        SET EnrolledStudents = MAX(0, EnrolledStudents - 1)
        WHERE CourseCode = ? AND SectionLetter = ? AND MeetingDay = ? AND StartTime = ?
      `,
      ).run(courseCode, sectionLetter, meetingDay, startTime);

      return { ok: true };
    });

    res.json(result);
  } catch (error) {
    console.error('[sqlite] drop failed', error);
    res.status(400).json({ error: error.message || 'Drop failed' });
  }
});

// Generic table read (keep last so specific routes above win)
app.get('/api/:table', (req, res) => {
  const table = String(req.params.table || '').toLowerCase();
  if (!allowedTables.includes(table)) {
    res.status(404).json({ error: 'Unknown table' });
    return;
  }

  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    res.json(rows);
  } catch (error) {
    console.error(`[sqlite] Failed to read from ${table}:`, error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`[sqlite] API listening on http://localhost:${port}`);
});
