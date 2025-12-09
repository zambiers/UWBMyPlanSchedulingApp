import { supabase } from './supabaseClient';

const DATA_SOURCE = (process.env.REACT_APP_DATA_SOURCE || 'supabase').toLowerCase();

const TABLE_MAP = {
  students: 'students',
  professors: 'professors',
  courses: 'courses',
  programs: 'degreeprogram',
  sections: 'section',
  'student-sections': 'studentsection',
  'student-degrees': 'studentdegreeprogram',
};

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
    .select('EmployeeID, FirstName, LastName')
    .in('EmployeeID', ids);
  if (profErr) throw new Error(profErr.message);
  const profMap = {};
  profs?.forEach((p) => {
    profMap[p.EmployeeID] = p;
  });

  return Object.values(load)
    .map((entry) => ({
      ...entry,
      InstructorName: profMap[entry.EmployeeID]
        ? `${profMap[entry.EmployeeID].FirstName} ${profMap[entry.EmployeeID].LastName}`
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
