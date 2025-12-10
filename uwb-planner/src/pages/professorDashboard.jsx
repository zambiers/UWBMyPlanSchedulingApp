import { useCallback, useMemo, useState } from 'react';
import {
  dropSection,
  enrollInSection,
  fetchInstructorSections,
  fetchSectionRoster,
  updateGrade,
} from '../database/dataService';

function InputRow({ label, children }) {
  return (
    <div className="form-row">
      <label>{label}</label>
      {children}
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

export default function ProfessorDashboard() {
  const [instructorId, setInstructorId] = useState('12');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [roster, setRoster] = useState([]);
  const [studentIdToAdd, setStudentIdToAdd] = useState('');
  const [gradeInput, setGradeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const hasInstructorId = useMemo(() => String(instructorId || '').trim().length > 0, [instructorId]);

  const loadSections = useCallback(async () => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const data = await fetchInstructorSections(instructorId);
      setSections(data);
      setSelectedSection(null);
      setRoster([]);
    } catch (err) {
      setError(err.message || 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  }, [instructorId]);

  const loadRoster = useCallback(
    async (section) => {
      setLoading(true);
      setError('');
      setInfo('');
      try {
        const data = await fetchSectionRoster(section);
        setSelectedSection(section);
        setRoster(data);
      } catch (err) {
        setError(err.message || 'Failed to load roster');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleAddStudent = useCallback(async () => {
    if (!selectedSection) return;
    setLoading(true);
    setError('');
    setInfo('');
    try {
      await enrollInSection({
        studentId: Number(studentIdToAdd),
        courseCode: selectedSection.CourseCode,
        sectionLetter: selectedSection.SectionLetter,
        meetingDay: selectedSection.MeetingDay,
        startTime: selectedSection.StartTime,
      });
      setInfo('Student added to section');
      await loadRoster(selectedSection);
    } catch (err) {
      setError(err.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  }, [loadRoster, selectedSection, studentIdToAdd]);

  const handleRemoveStudent = useCallback(
    async (row) => {
      if (!selectedSection) return;
      setLoading(true);
      setError('');
      setInfo('');
      try {
        await dropSection({
          studentId: row.StudentID,
          courseCode: selectedSection.CourseCode,
          sectionLetter: selectedSection.SectionLetter,
          meetingDay: selectedSection.MeetingDay,
          startTime: selectedSection.StartTime,
        });
        setInfo('Student removed');
        await loadRoster(selectedSection);
      } catch (err) {
        setError(err.message || 'Failed to remove student');
      } finally {
        setLoading(false);
      }
    },
    [loadRoster, selectedSection],
  );

  const handleAssignGrade = useCallback(
    async (row) => {
      if (!selectedSection) return;
      setLoading(true);
      setError('');
      setInfo('');
      try {
        await updateGrade({
          studentId: row.StudentID,
          courseCode: selectedSection.CourseCode,
          sectionLetter: selectedSection.SectionLetter,
          meetingDay: selectedSection.MeetingDay,
          startTime: selectedSection.StartTime,
          grade: gradeInput || null,
        });
        setInfo('Grade updated');
        await loadRoster(selectedSection);
      } catch (err) {
        setError(err.message || 'Failed to update grade');
      } finally {
        setLoading(false);
      }
    },
    [gradeInput, loadRoster, selectedSection],
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <h1>Professor Portal</h1>
      </div>
      <p className="muted">View your sections, manage rosters, add/remove students, and assign grades.</p>

      <div className="form-grid">
        <InputRow label="Instructor ID">
          <input value={instructorId} onChange={(e) => setInstructorId(e.target.value)} placeholder="e.g. 12" />
        </InputRow>
      </div>
      <div className="button-row">
        <button onClick={loadSections} disabled={!hasInstructorId || loading}>
          Load My Sections
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}
      {info && <div className="info">{info}</div>}

      <Section title="My Sections">
        <Table
          rows={sections}
          empty="No sections."
          columns={['CourseCode', 'SectionLetter', 'MeetingDay', 'StartTime', 'EndTime', 'EnrolledStudents', 'MaxEnrolled']}
          actions={[
            {
              label: 'View Roster',
              onClick: loadRoster,
            },
          ]}
        />
      </Section>

      <Section title={selectedSection ? `Roster for ${selectedSection.CourseCode} ${selectedSection.SectionLetter}` : 'Roster'}>
        <div className="form-grid">
          <InputRow label="Add existing student ID">
            <input value={studentIdToAdd} onChange={(e) => setStudentIdToAdd(e.target.value)} placeholder="Student ID" />
          </InputRow>
          <InputRow label="Grade to assign">
            <input value={gradeInput} onChange={(e) => setGradeInput(e.target.value)} placeholder="e.g. A-" />
          </InputRow>
        </div>
        <div className="button-row">
          <button onClick={handleAddStudent} disabled={!selectedSection || loading || !studentIdToAdd}>
            Add Student
          </button>
        </div>
        <Table
          rows={roster}
          empty="Select a section to view roster."
          columns={['StudentID', 'FirstName', 'LastName', 'Email', 'Grade']}
          actions={[
            { label: 'Remove', onClick: handleRemoveStudent },
            { label: 'Assign Grade', onClick: handleAssignGrade },
          ]}
        />
      </Section>
    </div>
  );
}

