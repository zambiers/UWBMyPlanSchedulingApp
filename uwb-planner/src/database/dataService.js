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
    .eq('StudentID', studentId);
  if (error) throw new Error(error.message);
  if (!enrollments || enrollments.length === 0) return [];

  const detailed = await Promise.all(
    enrollments.map(async (row) => {
      const { data: section, error: secErr } = await supabase
        .from('section')
        .select(
          'CourseCode, SectionLetter, MeetingDay, StartTime, EndTime, RoomNum, Instructor, courses (CourseName), professors:Instructor (FirstName, LastName)',
        )
        .match({
          CourseCode: row.CourseCode,
          SectionLetter: row.SectionLetter,
          MeetingDay: row.MeetingDay,
          StartTime: row.StartTime,
        })
        .maybeSingle();
      if (secErr) throw new Error(secErr.message);

      const courseName = section?.courses?.CourseName || row.CourseCode;
      const instructorName = section?.professors
        ? `${section.professors.FirstName} ${section.professors.LastName}`
        : '';

      return {
        StudentID: row.StudentID,
        StudentName: '',
        CourseCode: row.CourseCode,
        CourseName: courseName,
        SectionLetter: row.SectionLetter,
        MeetingDay: row.MeetingDay,
        StartTime: row.StartTime,
        EndTime: section?.EndTime || null,
        RoomNum: section?.RoomNum || '',
        InstructorName: instructorName,
        Grade: row.Grade,
      };
    }),
  );

  return detailed;
}

async function fetchOpenSectionsSupabase({ major, studentId }) {
  const { data: existing, error: existingErr } = await supabase
    .from('studentsection')
    .select('CourseCode')
    .eq('StudentID', studentId);
  if (existingErr) throw new Error(existingErr.message);
  const enrolledCourses = new Set((existing || []).map((r) => r.CourseCode));

  const { data: sections, error } = await supabase
    .from('section')
    .select('CourseCode, SectionLetter, MeetingDay, StartTime, EndTime, MaxEnrolled, EnrolledStudents, courses (CourseName, Major)')
    .eq('courses.Major', major);
  if (error) throw new Error(error.message);

  const rows = sections || [];
  return rows
    .filter((row) => !enrolledCourses.has(row.CourseCode) && row.EnrolledStudents < row.MaxEnrolled)
    .map((row) => ({
      CourseCode: row.CourseCode,
      CourseName: row.courses?.CourseName || row.CourseCode,
      SectionLetter: row.SectionLetter,
      MeetingDay: row.MeetingDay,
      StartTime: row.StartTime,
      EndTime: row.EndTime,
      SeatsAvailable: row.MaxEnrolled - row.EnrolledStudents,
    }));
}

async function enrollSupabase({ studentId, courseCode, sectionLetter, meetingDay, startTime }) {
  const { data: section, error: secErr } = await supabase
    .from('section')
    .select('MaxEnrolled, EnrolledStudents')
    .match({ CourseCode: courseCode, SectionLetter: sectionLetter, MeetingDay: meetingDay, StartTime: startTime })
    .single();
  if (secErr) throw new Error(secErr.message);
  if (section.EnrolledStudents >= section.MaxEnrolled) {
    throw new Error('Section is full');
  }

  const { data: existing, error: alreadyErr } = await supabase
    .from('studentsection')
    .select('StudentID')
    .match({ StudentID: studentId, CourseCode: courseCode, SectionLetter: sectionLetter, MeetingDay: meetingDay, StartTime: startTime })
    .maybeSingle();
  if (alreadyErr) throw new Error(alreadyErr.message);
  if (existing) throw new Error('Already enrolled');

  const { error: insertErr } = await supabase.from('studentsection').insert({
    StudentID: studentId,
    CourseCode: courseCode,
    SectionLetter: sectionLetter,
    MeetingDay: meetingDay,
    StartTime: startTime,
    Grade: null,
  });
  if (insertErr) throw new Error(insertErr.message);

  const { error: updateErr } = await supabase
    .from('section')
    .update({ EnrolledStudents: section.EnrolledStudents + 1 })
    .match({ CourseCode: courseCode, SectionLetter: sectionLetter, MeetingDay: meetingDay, StartTime: startTime });
  if (updateErr) throw new Error(updateErr.message);
  return { ok: true };
}

async function dropSupabase({ studentId, courseCode, sectionLetter, meetingDay, startTime }) {
  const { data: section, error: secErr } = await supabase
    .from('section')
    .select('EnrolledStudents')
    .match({ CourseCode: courseCode, SectionLetter: sectionLetter, MeetingDay: meetingDay, StartTime: startTime })
    .single();
  if (secErr) throw new Error(secErr.message);

  const { error: deleteErr } = await supabase
    .from('studentsection')
    .delete()
    .match({ StudentID: studentId, CourseCode: courseCode, SectionLetter: sectionLetter, MeetingDay: meetingDay, StartTime: startTime });
  if (deleteErr) throw new Error(deleteErr.message);

  const newCount = Math.max(0, (section?.EnrolledStudents || 0) - 1);
  const { error: updateErr } = await supabase
    .from('section')
    .update({ EnrolledStudents: newCount })
    .match({ CourseCode: courseCode, SectionLetter: sectionLetter, MeetingDay: meetingDay, StartTime: startTime });
  if (updateErr) throw new Error(updateErr.message);
  return { ok: true };
}

async function searchCoursesSupabase({ major, keyword }) {
  let query = supabase.from('courses').select('*');
  if (major) {
    query = query.eq('Major', major);
  }
  if (keyword) {
    query = query.ilike('CourseName', `%${keyword}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

async function fetchSectionsSupabase(courseCode) {
  const { data, error } = await supabase
    .from('section')
    .select(
      'CourseCode, SectionLetter, MeetingDay, StartTime, EndTime, RoomNum, MaxEnrolled, EnrolledStudents, Instructor, professors:Instructor (FirstName, LastName)',
    )
    .eq('CourseCode', courseCode);
  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({
    CourseCode: row.CourseCode,
    SectionLetter: row.SectionLetter,
    MeetingDay: row.MeetingDay,
    StartTime: row.StartTime,
    EndTime: row.EndTime,
    RoomNum: row.RoomNum,
    MaxEnrolled: row.MaxEnrolled,
    EnrolledStudents: row.EnrolledStudents,
    SeatsAvailable: (row.MaxEnrolled || 0) - (row.EnrolledStudents || 0),
    InstructorName: row.professors ? `${row.professors.FirstName} ${row.professors.LastName}` : '',
  }));
}
