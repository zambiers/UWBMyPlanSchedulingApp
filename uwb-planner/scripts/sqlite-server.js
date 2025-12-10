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
const tableConfigs = {
  students: {
    table: 'Students',
    primaryKey: ['StudentID'],
    columns: ['StudentID', 'FirstName', 'LastName', 'Major', 'Email'],
  },
  professors: {
    table: 'Professors',
    primaryKey: ['EmployeeID'],
    columns: ['EmployeeID', 'FirstName', 'LastName', 'Email', 'MajorOfInstruction'],
  },
  courses: {
    table: 'Courses',
    primaryKey: ['CourseCode'],
    columns: ['CourseCode', 'CourseName', 'Credits', 'Major', 'Description'],
  },
  section: {
    table: 'Section',
    primaryKey: ['CourseCode', 'SectionLetter', 'MeetingDay', 'StartTime'],
    columns: ['CourseCode', 'SectionLetter', 'MeetingDay', 'StartTime', 'EndTime', 'RoomNum', 'MaxEnrolled', 'EnrolledStudents', 'Instructor'],
  },
  degreeprogram: {
    table: 'DegreeProgram',
    primaryKey: ['DegreeName'],
    columns: ['DegreeName', 'DegreeType', 'SchoolDivision', 'EnrolledStudentsMax', 'Description'],
  },
  studentsection: {
    table: 'StudentSection',
    primaryKey: ['StudentID', 'CourseCode', 'SectionLetter', 'MeetingDay', 'StartTime'],
    columns: ['StudentID', 'CourseCode', 'SectionLetter', 'MeetingDay', 'StartTime', 'Grade'],
  },
  studentdegreeprogram: {
    table: 'StudentDegreeProgram',
    primaryKey: ['StudentID', 'DegreeName'],
    columns: ['StudentID', 'DegreeName'],
  },
};

const allowedTables = Object.keys(tableConfigs);

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

// Sections taught by a professor
app.get('/api/professors/:instructorId/sections', (req, res) => {
  const instructorId = Number(req.params.instructorId);
  if (Number.isNaN(instructorId)) {
    res.status(400).json({ error: 'Invalid instructor id' });
    return;
  }

  try {
    const rows = db
      .prepare(
        `
        SELECT CourseCode, SectionLetter, MeetingDay, StartTime, EndTime, RoomNum,
               MaxEnrolled, EnrolledStudents
        FROM Section
        WHERE Instructor = ?
        ORDER BY CourseCode, MeetingDay, StartTime;
      `,
      )
      .all(instructorId);
    res.json(rows);
  } catch (error) {
    console.error('[sqlite] instructor sections failed', error);
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
});

// Roster for a section
app.get('/api/sections/roster', (req, res) => {
  const { courseCode, sectionLetter, meetingDay, startTime } = req.query;
  if (!courseCode || !sectionLetter || !meetingDay || !startTime) {
    res.status(400).json({ error: 'Missing section identifier' });
    return;
  }

  try {
    const rows = db
      .prepare(
        `
        SELECT ss.StudentID,
               ss.CourseCode,
               ss.SectionLetter,
               ss.MeetingDay,
               ss.StartTime,
               ss.Grade,
               s.FirstName,
               s.LastName,
               s.Email
        FROM StudentSection ss
        JOIN Students s ON ss.StudentID = s.StudentID
        WHERE ss.CourseCode = ?
          AND ss.SectionLetter = ?
          AND ss.MeetingDay = ?
          AND ss.StartTime = ?
        ORDER BY s.LastName, s.FirstName;
      `,
      )
      .all(courseCode, sectionLetter, meetingDay, startTime);
    res.json(rows);
  } catch (error) {
    console.error('[sqlite] roster failed', error);
    res.status(500).json({ error: 'Failed to fetch roster' });
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

// Aggregation: students per degree program
app.get('/api/queries/students-per-degree', (req, res) => {
  try {
    const rows = db
      .prepare(
        `
        SELECT d.DegreeName,
               d.DegreeType,
               COUNT(sdp.StudentID) AS EnrolledStudents
        FROM DegreeProgram d
        LEFT JOIN StudentDegreeProgram sdp ON d.DegreeName = sdp.DegreeName
        GROUP BY d.DegreeName, d.DegreeType
        ORDER BY EnrolledStudents DESC, d.DegreeName;
      `,
      )
      .all();
    res.json(rows);
  } catch (error) {
    console.error('[sqlite] students-per-degree failed', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Aggregation: instructor teaching load
app.get('/api/queries/instructor-load', (req, res) => {
  try {
    const rows = db
      .prepare(
        `
        SELECT p.EmployeeID,
               p.FirstName || ' ' || p.LastName AS InstructorName,
               COUNT(se.CourseCode) AS NumberOfSections,
               COALESCE(SUM(se.MaxEnrolled), 0) AS TotalCapacity
        FROM Professors p
        LEFT JOIN Section se ON p.EmployeeID = se.Instructor
        GROUP BY p.EmployeeID, p.FirstName, p.LastName
        ORDER BY NumberOfSections DESC;
      `,
      )
      .all();
    res.json(rows);
  } catch (error) {
    console.error('[sqlite] instructor-load failed', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Nested: students with no enrollments
app.get('/api/queries/students-no-enrollments', (req, res) => {
  try {
    const rows = db
      .prepare(
        `
        SELECT s.StudentID, s.FirstName, s.LastName, s.Major
        FROM Students s
        WHERE NOT EXISTS (
          SELECT 1
          FROM StudentSection ss
          WHERE ss.StudentID = s.StudentID
        );
      `,
      )
      .all();
    res.json(rows);
  } catch (error) {
    console.error('[sqlite] students-no-enrollments failed', error);
    res.status(500).json({ error: 'Failed to fetch data' });
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

// Update grade for a student in a section
app.post('/api/sections/grade', (req, res) => {
  const { studentId, courseCode, sectionLetter, meetingDay, startTime, grade } = req.body || {};
  if (!studentId || !courseCode || !sectionLetter || !meetingDay || !startTime) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const result = db
      .prepare(
        `
        UPDATE StudentSection
        SET Grade = ?
        WHERE StudentID = ? AND CourseCode = ? AND SectionLetter = ? AND MeetingDay = ? AND StartTime = ?
      `,
      )
      .run(grade ?? null, studentId, courseCode, sectionLetter, meetingDay, startTime);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Enrollment not found' });
      return;
    }
    res.json({ ok: true });
  } catch (error) {
    console.error('[sqlite] update grade failed', error);
    res.status(500).json({ error: 'Failed to update grade' });
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

// Generic create
app.post('/api/:table', (req, res) => {
  const config = getTableConfig(req.params.table);
  if (!config) {
    res.status(404).json({ error: 'Unknown table' });
    return;
  }

  try {
    const payload = extractPayload(req.body, config);
    const missing = config.primaryKey.filter((col) => payload[col] === undefined || payload[col] === null || payload[col] === '');
    if (missing.length > 0) {
      res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
      return;
    }
    if (Object.keys(payload).length === 0) {
      res.status(400).json({ error: 'No fields provided' });
      return;
    }

    const columnsSql = Object.keys(payload).join(', ');
    const placeholders = Object.keys(payload)
      .map((col) => `@${col}`)
      .join(', ');
    const stmt = db.prepare(`INSERT INTO ${config.table} (${columnsSql}) VALUES (${placeholders})`);
    const result = stmt.run(payload);
    res.json({ ok: true, changes: result.changes });
  } catch (error) {
    console.error(`[sqlite] create failed for ${config.table}`, error);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// Generic update
app.put('/api/:table', (req, res) => {
  const config = getTableConfig(req.params.table);
  if (!config) {
    res.status(404).json({ error: 'Unknown table' });
    return;
  }

  try {
    const payload = extractPayload(req.body, config);
    const matchParams = {};
    for (const col of config.primaryKey) {
      const value = payload[col];
      if (value === undefined || value === null || value === '') {
        res.status(400).json({ error: `Missing key field: ${col}` });
        return;
      }
      matchParams[col] = value;
      delete payload[col];
    }

    const updateColumns = Object.keys(payload);
    if (updateColumns.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    const params = {};
    updateColumns.forEach((col) => {
      params[`set_${col}`] = payload[col];
    });
    Object.entries(matchParams).forEach(([col, value]) => {
      params[`where_${col}`] = value;
    });

    const setSql = updateColumns.map((col) => `${col} = @set_${col}`).join(', ');
    const whereSql = config.primaryKey.map((col) => `${col} = @where_${col}`).join(' AND ');
    const stmt = db.prepare(`UPDATE ${config.table} SET ${setSql} WHERE ${whereSql}`);
    const result = stmt.run(params);
    res.json({ ok: true, changes: result.changes });
  } catch (error) {
    console.error(`[sqlite] update failed for ${config.table}`, error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// Generic delete
app.delete('/api/:table', (req, res) => {
  const config = getTableConfig(req.params.table);
  if (!config) {
    res.status(404).json({ error: 'Unknown table' });
    return;
  }

  try {
    const payload = extractPayload(req.body, config);
    const missing = config.primaryKey.filter((col) => payload[col] === undefined || payload[col] === null || payload[col] === '');
    if (missing.length > 0) {
      res.status(400).json({ error: `Missing key field(s): ${missing.join(', ')}` });
      return;
    }

    const whereSql = config.primaryKey.map((col) => `${col} = @${col}`).join(' AND ');
    const stmt = db.prepare(`DELETE FROM ${config.table} WHERE ${whereSql}`);
    const result = stmt.run(payload);
    res.json({ ok: true, changes: result.changes });
  } catch (error) {
    console.error(`[sqlite] delete failed for ${config.table}`, error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// Generic table read (keep last so specific routes above win)
app.get('/api/:table', (req, res) => {
  const config = getTableConfig(req.params.table);
  if (!config) {
    res.status(404).json({ error: 'Unknown table' });
    return;
  }

  try {
    const rows = db.prepare(`SELECT * FROM ${config.table}`).all();
    res.json(rows);
  } catch (error) {
    console.error(`[sqlite] Failed to read from ${config.table}:`, error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

function getTableConfig(name) {
  const key = String(name || '').toLowerCase();
  return tableConfigs[key];
}

function extractPayload(body, config) {
  const payload = {};
  config.columns.forEach((col) => {
    const matchKey = Object.keys(body || {}).find((key) => key.toLowerCase() === col.toLowerCase());
    if (matchKey !== undefined && body[matchKey] !== undefined) {
      payload[col] = body[matchKey];
    }
  });
  return payload;
}

app.listen(port, () => {
  console.log(`[sqlite] API listening on http://localhost:${port}`);
});
