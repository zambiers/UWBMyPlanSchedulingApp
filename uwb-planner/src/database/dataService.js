import { supabase } from './supabaseClient';

const DATA_SOURCE = (process.env.REACT_APP_DATA_SOURCE || 'supabase').toLowerCase();

const TABLE_CONFIG = {
  students: {
    table: 'students',
    primaryKey: ['studentid'],
    columns: ['studentid', 'firstname', 'lastname', 'major', 'email'],
  },
  professors: {
    table: 'professors',
    primaryKey: ['employeeid'],
    columns: ['employeeid', 'firstname', 'lastname', 'email', 'majorofinstruction'],
  },
  courses: {
    table: 'courses',
    primaryKey: ['coursecode'],
    columns: ['coursecode', 'coursename', 'credits', 'major', 'description'],
  },
  programs: {
    table: 'degreeprogram',
    primaryKey: ['degreename'],
    columns: ['degreename', 'degreetype', 'schooldivision', 'enrolledstudentsmax', 'description'],
  },
  sections: {
    table: 'section',
    primaryKey: ['coursecode', 'sectionletter', 'meetingday', 'starttime'],
    columns: [
      'coursecode',
      'sectionletter',
      'meetingday',
      'starttime',
      'endtime',
      'roomnum',
      'maxenrolled',
      'enrolledstudents',
      'instructor',
    ],
  },
  'student-sections': {
    table: 'studentsection',
    primaryKey: ['studentid', 'coursecode', 'sectionletter', 'meetingday', 'starttime'],
    columns: ['studentid', 'coursecode', 'sectionletter', 'meetingday', 'starttime', 'grade'],
  },
  'student-degrees': {
    table: 'studentdegreeprogram',
    primaryKey: ['studentid', 'degreename'],
    columns: ['studentid', 'degreename'],
  },
};

const TABLE_MAP = Object.fromEntries(Object.entries(TABLE_CONFIG).map(([key, value]) => [key, value.table]));

export function getDataSource() {
  return DATA_SOURCE;
}

export async function fetchTableData(tableKey) {
  const normalizedKey = String(tableKey || '').toLowerCase();
  const tableName = TABLE_MAP[normalizedKey];

  if (!tableName) {
    throw new Error(`Unknown table: ${tableKey}`);
  }

  if (DATA_SOURCE === 'sqlite') {
    return fetchFromApi(tableName);
  }

  return fetchFromSupabase(tableName);
}

export async function createRecord(tableKey, payload) {
  const config = getTableConfig(tableKey);
  const normalizedPayload = normalizePayload(payload, config);
  ensurePrimaryKeyFields(config, normalizedPayload);

  if (DATA_SOURCE === 'sqlite') {
    return postToApi(config.table, normalizedPayload);
  }
  const { data, error } = await supabase.from(config.table).insert(normalizedPayload).select();
  if (error) {
    throw new Error(error.message || 'Create failed');
  }
  return data?.[0] ?? null;
}

export async function updateRecord(tableKey, payload) {
  const config = getTableConfig(tableKey);
  const normalizedPayload = normalizePayload(payload, config);
  const match = buildMatchObject(config, normalizedPayload);
  const updateFields = stripPrimaryKeyFields(config, normalizedPayload);

  if (Object.keys(updateFields).length === 0) {
    throw new Error('No fields to update');
  }

  if (DATA_SOURCE === 'sqlite') {
    return putToApi(config.table, { ...match, ...updateFields });
  }
  const { data, error } = await supabase.from(config.table).update(updateFields).match(match).select();
  if (error) {
    throw new Error(error.message || 'Update failed');
  }
  return data?.[0] ?? null;
}

export async function deleteRecord(tableKey, payload) {
  const config = getTableConfig(tableKey);
  const normalizedPayload = normalizePayload(payload, config);
  const match = buildMatchObject(config, normalizedPayload);

  if (DATA_SOURCE === 'sqlite') {
    return deleteFromApi(config.table, match);
  }
  const { error } = await supabase.from(config.table).delete().match(match);
  if (error) {
    throw new Error(error.message || 'Delete failed');
  }
  return { ok: true };
}

// ---------- Student flows ----------
export async function fetchStudentSchedule(studentId) {
  if (DATA_SOURCE === 'sqlite') {
    const response = await fetch(`/api/students/${studentId}/schedule`);
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    return response.json();
  }
  return fetchScheduleSupabase(studentId);
}

export async function fetchOpenSections({ major, studentId }) {
  if (DATA_SOURCE === 'sqlite') {
    const params = new URLSearchParams({ major, studentId });
    const response = await fetch(`/api/open-sections?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch open sections');
    }
    return response.json();
  }
  return fetchOpenSectionsSupabase({ major, studentId });
}

export async function enrollInSection(payload) {
  if (DATA_SOURCE === 'sqlite') {
    const response = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Enroll failed');
    }
    return response.json();
  }
  return enrollSupabase(payload);
}

export async function dropSection(payload) {
  if (DATA_SOURCE === 'sqlite') {
    const response = await fetch('/api/enroll', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Drop failed');
    }
    return response.json();
  }
  return dropSupabase(payload);
}

export async function searchCourses({ major, keyword }) {
  if (DATA_SOURCE === 'sqlite') {
    const params = new URLSearchParams();
    if (major) params.append('major', major);
    if (keyword) params.append('keyword', keyword);
    const response = await fetch(`/api/courses/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to search courses');
    }
    return response.json();
  }
  return searchCoursesSupabase({ major, keyword });
}

export async function fetchSectionsByCourse(courseCode) {
  if (!courseCode) throw new Error('Course code required');
  if (DATA_SOURCE === 'sqlite') {
    const response = await fetch(`/api/courses/${encodeURIComponent(courseCode)}/sections`);
    if (!response.ok) {
      throw new Error('Failed to load sections');
    }
    return response.json();
  }
  return fetchSectionsSupabase(courseCode);
}

export async function fetchInstructorSections(instructorId) {
  if (DATA_SOURCE === 'sqlite') {
    const response = await fetch(`/api/professors/${instructorId}/sections`);
    if (!response.ok) throw new Error('Failed to load sections');
    return response.json();
  }
  return fetchInstructorSectionsSupabase(instructorId);
}

export async function fetchSectionRoster(section) {
  const params = new URLSearchParams({
    courseCode: section.CourseCode,
    sectionLetter: section.SectionLetter,
    meetingDay: section.MeetingDay,
    startTime: section.StartTime,
  });
  if (DATA_SOURCE === 'sqlite') {
    const response = await fetch(`/api/sections/roster?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to load roster');
    return response.json();
  }
  return fetchSectionRosterSupabase(section);
}

export async function updateGrade({ studentId, courseCode, sectionLetter, meetingDay, startTime, grade }) {
  if (DATA_SOURCE === 'sqlite') {
    const response = await fetch('/api/sections/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseCode, sectionLetter, meetingDay, startTime, grade }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update grade');
    }
    return response.json();
  }
  return updateGradeSupabase({ studentId, courseCode, sectionLetter, meetingDay, startTime, grade });
}

export async function queryStudentsPerDegree() {
  if (DATA_SOURCE === 'sqlite') {
    const response = await fetch('/api/queries/students-per-degree');
    if (!response.ok) throw new Error('Failed to run query');
    return response.json();
  }
  return queryStudentsPerDegreeSupabase();
}

export async function queryInstructorLoad() {
  if (DATA_SOURCE === 'sqlite') {
    const response = await fetch('/api/queries/instructor-load');
    if (!response.ok) throw new Error('Failed to run query');
    return response.json();
  }
  return queryInstructorLoadSupabase();
}

export async function queryStudentsNoEnrollments() {
  if (DATA_SOURCE === 'sqlite') {
    const response = await fetch('/api/queries/students-no-enrollments');
    if (!response.ok) throw new Error('Failed to run query');
    return response.json();
  }
  return queryStudentsNoEnrollmentsSupabase();
}

async function fetchFromApi(tableName) {
  const response = await fetch(`/api/${tableName}`);
  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }
  return response.json();
}

async function fetchFromSupabase(tableName) {
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    throw new Error(error.message || 'Supabase request failed');
  }
  return data || [];
}

function getTableConfig(tableKey) {
  const normalizedKey = String(tableKey || '').toLowerCase();
  const config = TABLE_CONFIG[normalizedKey];
  if (!config) {
    throw new Error(`Unknown table: ${tableKey}`);
  }
  return config;
}

function normalizePayload(payload, config) {
  const normalized = {};
  Object.entries(payload || {}).forEach(([key, value]) => {
    const lower = key.toLowerCase();
    if (config.columns.includes(lower)) {
      normalized[lower] = value;
    }
  });
  return normalized;
}

function ensurePrimaryKeyFields(config, payload) {
  const missing = config.primaryKey.filter((key) => payload[key] === undefined || payload[key] === null || payload[key] === '');
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

function buildMatchObject(config, payload) {
  ensurePrimaryKeyFields(config, payload);
  return config.primaryKey.reduce((acc, key) => {
    acc[key] = payload[key];
    return acc;
  }, {});
}

function stripPrimaryKeyFields(config, payload) {
  const clone = { ...payload };
  config.primaryKey.forEach((key) => delete clone[key]);
  return clone;
}

async function postToApi(tableName, body) {
  const response = await fetch(`/api/${tableName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Create failed');
  }
  return response.json();
}

async function putToApi(tableName, body) {
  const response = await fetch(`/api/${tableName}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Update failed');
  }
  return response.json();
}

async function deleteFromApi(tableName, body) {
  const response = await fetch(`/api/${tableName}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Delete failed');
  }
  return response.json();
}

// ---------- Supabase helpers ----------
async function fetchScheduleSupabase(studentId) {
  const { data: enrollments, error } = await supabase
    .from('studentsection')
    .select('*')
    .eq('studentid', studentId);
  if (error) throw new Error(error.message);
  if (!enrollments || enrollments.length === 0) return [];

  const detailed = await Promise.all(
    enrollments.map(async (row) => {
      const { data: section, error: secErr } = await supabase
        .from('section')
        .select(
          'coursecode, sectionletter, meetingday, starttime, endtime, roomnum, instructor, courses (coursename), professors:instructor (firstname, lastname)',
        )
        .match({
          coursecode: row.coursecode,
          sectionletter: row.sectionletter,
          meetingday: row.meetingday,
          starttime: row.starttime,
        })
        .maybeSingle();
      if (secErr) throw new Error(secErr.message);

      const courseName = section?.courses?.coursename || row.coursecode;
      const instructorName = section?.professors
        ? `${section.professors.firstname} ${section.professors.lastname}`
        : '';

      return {
        StudentID: row.studentid,
        StudentName: '',
        CourseCode: row.coursecode,
        CourseName: courseName,
        SectionLetter: row.sectionletter,
        MeetingDay: row.meetingday,
        StartTime: row.starttime,
        EndTime: section?.endtime || null,
        RoomNum: section?.roomnum || '',
        InstructorName: instructorName,
        Grade: row.grade,
      };
    }),
  );

  return detailed;
}

async function fetchOpenSectionsSupabase({ major, studentId }) {
  const { data: existing, error: existingErr } = await supabase
    .from('studentsection')
    .select('coursecode')
    .eq('studentid', studentId);
  if (existingErr) throw new Error(existingErr.message);
  const enrolledCourses = new Set((existing || []).map((r) => r.coursecode));

  const { data: sections, error } = await supabase
    .from('section')
    .select('coursecode, sectionletter, meetingday, starttime, endtime, maxenrolled, enrolledstudents, courses (coursename, major)')
    .eq('courses.major', major);
  if (error) throw new Error(error.message);

  const rows = sections || [];
  return rows
    .filter((row) => !enrolledCourses.has(row.coursecode) && row.enrolledstudents < row.maxenrolled)
    .map((row) => ({
      CourseCode: row.coursecode,
      CourseName: row.courses?.coursename || row.coursecode,
      SectionLetter: row.sectionletter,
      MeetingDay: row.meetingday,
      StartTime: row.starttime,
      EndTime: row.endtime,
      SeatsAvailable: (row.maxenrolled || 0) - (row.enrolledstudents || 0),
    }));
}

async function enrollSupabase({ studentId, courseCode, sectionLetter, meetingDay, startTime }) {
  const { data: section, error: secErr } = await supabase
    .from('section')
    .select('maxenrolled, enrolledstudents')
    .match({ coursecode: courseCode, sectionletter: sectionLetter, meetingday: meetingDay, starttime: startTime })
    .single();
  if (secErr) throw new Error(secErr.message);
  if (section.enrolledstudents >= section.maxenrolled) {
    throw new Error('Section is full');
  }

  const { data: existing, error: alreadyErr } = await supabase
    .from('studentsection')
    .select('studentid')
    .match({ studentid: studentId, coursecode: courseCode, sectionletter: sectionLetter, meetingday: meetingDay, starttime: startTime })
    .maybeSingle();
  if (alreadyErr) throw new Error(alreadyErr.message);
  if (existing) throw new Error('Already enrolled');

  const { error: insertErr } = await supabase.from('studentsection').insert({
    studentid: studentId,
    coursecode: courseCode,
    sectionletter: sectionLetter,
    meetingday: meetingDay,
    starttime: startTime,
    grade: null,
  });
  if (insertErr) throw new Error(insertErr.message);

  const { error: updateErr } = await supabase
    .from('section')
    .update({ enrolledstudents: (section.enrolledstudents || 0) + 1 })
    .match({ coursecode: courseCode, sectionletter: sectionLetter, meetingday: meetingDay, starttime: startTime });
  if (updateErr) throw new Error(updateErr.message);
  return { ok: true };
}

async function dropSupabase({ studentId, courseCode, sectionLetter, meetingDay, startTime }) {
  const { data: section, error: secErr } = await supabase
    .from('section')
    .select('enrolledstudents')
    .match({ coursecode: courseCode, sectionletter: sectionLetter, meetingday: meetingDay, starttime: startTime })
    .single();
  if (secErr) throw new Error(secErr.message);

  const { error: deleteErr } = await supabase
    .from('studentsection')
    .delete()
    .match({ studentid: studentId, coursecode: courseCode, sectionletter: sectionLetter, meetingday: meetingDay, starttime: startTime });
  if (deleteErr) throw new Error(deleteErr.message);

  const newCount = Math.max(0, (section?.enrolledstudents || 0) - 1);
  const { error: updateErr } = await supabase
    .from('section')
    .update({ enrolledstudents: newCount })
    .match({ coursecode: courseCode, sectionletter: sectionLetter, meetingday: meetingDay, starttime: startTime });
  if (updateErr) throw new Error(updateErr.message);
  return { ok: true };
}

async function searchCoursesSupabase({ major, keyword }) {
  let query = supabase.from('courses').select('*');
  if (major) {
    query = query.eq('major', major);
  }
  if (keyword) {
    query = query.ilike('coursename', `%${keyword}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({
    CourseCode: row.coursecode || row.CourseCode,
    CourseName: row.coursename || row.CourseName,
    Credits: row.credits ?? row.Credits,
    Major: row.major || row.Major,
    Description: row.description || row.Description,
  }));
}

async function fetchSectionsSupabase(courseCode) {
  const { data, error } = await supabase
    .from('section')
    .select('coursecode, sectionletter, meetingday, starttime, endtime, roomnum, maxenrolled, enrolledstudents, instructor')
    .eq('coursecode', courseCode);
  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({
    CourseCode: row.coursecode || row.CourseCode,
    SectionLetter: row.sectionletter || row.SectionLetter,
    MeetingDay: row.meetingday || row.MeetingDay,
    StartTime: row.starttime || row.StartTime,
    EndTime: row.endtime || row.EndTime,
    RoomNum: row.roomnum || row.RoomNum,
    MaxEnrolled: row.maxenrolled ?? row.MaxEnrolled,
    EnrolledStudents: row.enrolledstudents ?? row.EnrolledStudents,
    SeatsAvailable: (row.maxenrolled ?? row.MaxEnrolled ?? 0) - (row.enrolledstudents ?? row.EnrolledStudents ?? 0),
    InstructorName: '',
  }));
}

async function fetchInstructorSectionsSupabase(instructorId) {
  const { data, error } = await supabase
    .from('section')
    .select('coursecode, sectionletter, meetingday, starttime, endtime, roomnum, maxenrolled, enrolledstudents')
    .eq('instructor', instructorId);
  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({
    CourseCode: row.coursecode,
    SectionLetter: row.sectionletter,
    MeetingDay: row.meetingday,
    StartTime: row.starttime,
    EndTime: row.endtime,
    RoomNum: row.roomnum,
    MaxEnrolled: row.maxenrolled,
    EnrolledStudents: row.enrolledstudents,
  }));
}

async function fetchSectionRosterSupabase(section) {
  const { data, error } = await supabase
    .from('studentsection')
    .select('studentid, grade, students (firstname, lastname, email)')
    .match({
      coursecode: section.CourseCode,
      sectionletter: section.SectionLetter,
      meetingday: section.MeetingDay,
      starttime: section.StartTime,
    });
  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({
    StudentID: row.studentid,
    Grade: row.grade,
    FirstName: row.students?.firstname || '',
    LastName: row.students?.lastname || '',
    Email: row.students?.email || '',
    CourseCode: section.CourseCode,
    SectionLetter: section.SectionLetter,
    MeetingDay: section.MeetingDay,
    StartTime: section.StartTime,
  }));
}

async function updateGradeSupabase({ studentId, courseCode, sectionLetter, meetingDay, startTime, grade }) {
  const { error } = await supabase
    .from('studentsection')
    .update({ grade })
    .match({
      studentid: studentId,
      coursecode: courseCode,
      sectionletter: sectionLetter,
      meetingday: meetingDay,
      starttime: startTime,
    });
  if (error) throw new Error(error.message);
  return { ok: true };
}

async function queryStudentsPerDegreeSupabase() {
  const { data, error } = await supabase
    .from('studentdegreeprogram')
    .select('degreename, degreeprogram (degreetype)')
    .returns();
  if (error) throw new Error(error.message);
  const counts = {};
  data?.forEach((row) => {
    const name = row.degreename || row.DegreeName;
    const type = row.degreeprogram?.degreetype || row.DegreeProgram?.DegreeType || '';
    if (!counts[name]) counts[name] = { DegreeName: name, DegreeType: type, EnrolledStudents: 0 };
    counts[name].EnrolledStudents += 1;
  });
  return Object.values(counts).sort((a, b) => b.EnrolledStudents - a.EnrolledStudents);
}

async function queryInstructorLoadSupabase() {
  const { data: sections, error } = await supabase
    .from('section')
    .select('instructor, maxenrolled');
  if (error) throw new Error(error.message);
  const load = {};
  sections?.forEach((row) => {
    if (!row.instructor) return;
    if (!load[row.instructor]) load[row.instructor] = { EmployeeID: row.instructor, NumberOfSections: 0, TotalCapacity: 0 };
    load[row.instructor].NumberOfSections += 1;
    load[row.instructor].TotalCapacity += row.maxenrolled || 0;
  });
  const ids = Object.keys(load);
  if (ids.length === 0) return [];

  const { data: profs, error: profErr } = await supabase
    .from('professors')
    .select('employeeid, firstname, lastname')
    .in('employeeid', ids);
  if (profErr) throw new Error(profErr.message);
  const profMap = {};
  profs?.forEach((p) => {
    profMap[p.employeeid] = p;
  });

  return Object.values(load)
    .map((entry) => ({
      ...entry,
      InstructorName: profMap[entry.EmployeeID]
        ? `${profMap[entry.EmployeeID].firstname ?? ''} ${profMap[entry.EmployeeID].lastname ?? ''}`.trim()
        : '',
    }))
    .sort((a, b) => b.NumberOfSections - a.NumberOfSections);
}

async function queryStudentsNoEnrollmentsSupabase() {
  const { data: students, error } = await supabase.from('students').select('*');
  if (error) throw new Error(error.message);
  const { data: enrollments, error: enrErr } = await supabase.from('studentsection').select('studentid');
  if (enrErr) throw new Error(enrErr.message);
  const enrolled = new Set((enrollments || []).map((e) => e.studentid));
  return (students || []).filter((s) => !enrolled.has(s.studentid ?? s.StudentID));
}
