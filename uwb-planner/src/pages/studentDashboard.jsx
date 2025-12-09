import { useCallback, useMemo, useState } from 'react';
import {
  dropSection,
  enrollInSection,
  fetchSectionsByCourse,
  fetchStudentSchedule,
  searchCourses,
} from '../database/dataService';

function InputRow({ label, children }) {
  return (
    <div className="form-row">
      <label>{label}</label>
      {children}
    </div>
  );
}

export default function StudentDashboard() {
  const [studentId, setStudentId] = useState('8952211');
  const [keyword, setKeyword] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const hasStudentId = useMemo(() => String(studentId || '').trim().length > 0, [studentId]);

  const handleLoadSchedule = useCallback(async () => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const data = await fetchStudentSchedule(Number(studentId));
      setSchedule(data);
    } catch (err) {
      setError(err.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const handleSearchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const data = await searchCourses({ major: null, keyword });
      setCourses(data);
      setSections([]);
      setSelectedCourse(null);
    } catch (err) {
      setError(err.message || 'Failed to search courses');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  const handleLoadSections = useCallback(
    async (course) => {
      setLoading(true);
      setError('');
      setInfo('');
      try {
        const data = await fetchSectionsByCourse(course.CourseCode);
        setSections(data);
        setSelectedCourse(course);
      } catch (err) {
        setError(err.message || 'Failed to load sections');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleEnroll = useCallback(
    async (section) => {
      setLoading(true);
      setError('');
      setInfo('');
      try {
        await enrollInSection({
          studentId: Number(studentId),
          courseCode: section.CourseCode,
          sectionLetter: section.SectionLetter,
          meetingDay: section.MeetingDay,
          startTime: section.StartTime,
        });
        setInfo(`Enrolled in ${section.CourseCode} ${section.SectionLetter}`);
        await handleLoadSchedule();
        if (selectedCourse) {
          await handleLoadSections(selectedCourse);
        }
      } catch (err) {
        setError(err.message || 'Enroll failed');
      } finally {
        setLoading(false);
      }
    },
    [handleLoadSchedule, handleLoadSections, selectedCourse, studentId],
  );

  const handleDrop = useCallback(
    async (section) => {
      setLoading(true);
      setError('');
      setInfo('');
      try {
        await dropSection({
          studentId: Number(studentId),
          courseCode: section.CourseCode,
          sectionLetter: section.SectionLetter,
          meetingDay: section.MeetingDay,
          startTime: section.StartTime,
        });
        setInfo(`Dropped ${section.CourseCode} ${section.SectionLetter}`);
        await handleLoadSchedule();
        if (selectedCourse) {
          await handleLoadSections(selectedCourse);
        }
      } catch (err) {
        setError(err.message || 'Drop failed');
      } finally {
        setLoading(false);
      }
    },
    [handleLoadSchedule, handleLoadSections, selectedCourse, studentId],
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <h1>Student Portal</h1>
      </div>
      <div className="muted">Uses sample query 1 (schedule) and course/section selection for enrollment.</div>

      <div className="form-grid">
        <InputRow label="Student ID">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. 8952211"
          />
        </InputRow>
        <InputRow label="Keyword">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="optional course search"
          />
        </InputRow>
      </div>

      <div className="button-row">
        <button onClick={handleLoadSchedule} disabled={!hasStudentId || loading}>
          View My Schedule
        </button>
        <button onClick={handleSearchCourses} disabled={loading}>
          Search/List Courses
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}
      {info && <div className="info">{info}</div>}

      <Section title="My Schedule">
        <Table
          rows={schedule}
          empty="No schedule yet."
          columns={[
            'CourseCode',
            'CourseName',
            'SectionLetter',
            'MeetingDay',
            'StartTime',
            'EndTime',
            'RoomNum',
            'InstructorName',
            'Grade',
          ]}
          actions={[
            {
              label: 'Drop',
              onClick: handleDrop,
            },
          ]}
        />
      </Section>

      <Section title="Courses">
        <Table
          rows={courses}
          empty="No results."
          columns={['CourseCode', 'CourseName', 'Credits', 'Major']}
          actions={[
            {
              label: 'View Sections',
              onClick: handleLoadSections,
            },
          ]}
        />
      </Section>

      <Section title={selectedCourse ? `Sections for ${selectedCourse.CourseCode}` : 'Sections'}>
        <Table
          rows={sections}
          empty="Select a course to view sections."
          columns={[
            'CourseCode',
            'SectionLetter',
            'MeetingDay',
            'StartTime',
            'EndTime',
            'SeatsAvailable',
            'RoomNum',
          ]}
          actions={[
            {
              label: 'Enroll',
              onClick: handleEnroll,
            },
          ]}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="subpanel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Table({ rows, columns, actions = [], empty }) {
  if (!rows || rows.length === 0) {
    return <p>{empty}</p>;
  }
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            {actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
              {actions.length > 0 && (
                <td>
                  {actions.map((action) => (
                    <button key={action.label} onClick={() => action.onClick(row)}>
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
