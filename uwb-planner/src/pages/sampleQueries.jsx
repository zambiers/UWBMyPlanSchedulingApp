import { useState } from 'react';
import {
  fetchOpenSections,
  fetchStudentSchedule,
  queryInstructorLoad,
  queryStudentsNoEnrollments,
  queryStudentsPerDegree,
} from '../database/dataService';

function QueryCard({ title, description, inputs, onRun, result }) {
  return (
    <div className="subpanel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <p className="muted">{description}</p>
      {inputs}
      <div className="button-row">
        <button onClick={onRun}>Run</button>
      </div>
      {result?.error && <div className="error">Error: {result.error}</div>}
      {result?.rows && <ResultTable rows={result.rows} />}
      {result?.rows && result.rows.length === 0 && <p>No results.</p>}
    </div>
  );
}

function ResultTable({ rows }) {
  if (!rows || rows.length === 0) return null;
  const columns = Object.keys(rows[0]);
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{String(row[col] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SampleQueries() {
  const [studentId, setStudentId] = useState('8952211');
  const [major, setMajor] = useState('');
  const [results, setResults] = useState({});
  const [loadingKey, setLoadingKey] = useState('');

  const run = async (key, fn) => {
    setLoadingKey(key);
    setResults((prev) => ({ ...prev, [key]: { rows: null, error: null } }));
    try {
      const rows = await fn();
      setResults((prev) => ({ ...prev, [key]: { rows, error: null } }));
    } catch (err) {
      setResults((prev) => ({ ...prev, [key]: { rows: null, error: err.message } }));
    } finally {
      setLoadingKey('');
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h1>Sample Queries</h1>
      </div>
      <p className="muted">Run queries one at a time; results show below each card.</p>

      <QueryCard
        title="1) Student Weekly Schedule (query 1)"
        description="Student’s current sections with meeting times, room, instructor, grade."
        inputs={
          <div className="form-row">
            <label>Student ID</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          </div>
        }
        onRun={() => run('schedule', () => fetchStudentSchedule(Number(studentId)))}
        result={results.schedule}
      />

      <QueryCard
        title="2) Students Per Degree Program (GROUP BY + COUNT)"
        description="Counts enrollment per degree program."
        onRun={() => run('perDegree', () => queryStudentsPerDegree())}
        result={results.perDegree}
      />

      <QueryCard
        title="3) Instructor Teaching Load (GROUP BY + COUNT + SUM)"
        description="Sections taught and total capacity per instructor."
        onRun={() => run('load', () => queryInstructorLoad())}
        result={results.load}
      />

      <QueryCard
        title="4) Students With No Enrollments (nested NOT EXISTS)"
        description="Students who are not enrolled in any section."
        onRun={() => run('noEnroll', () => queryStudentsNoEnrollments())}
        result={results.noEnroll}
      />

      <QueryCard
        title="5) Open Sections Not Already Enrolled (query 5)"
        description="Open seats in a major that the student is not already taking."
        inputs={
          <>
            <div className="form-row">
              <label>Student ID</label>
              <input value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Major</label>
              <input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="e.g. Computer Science" />
            </div>
          </>
        }
        onRun={() => run('open', () => fetchOpenSections({ major, studentId: Number(studentId) }))}
        result={results.open}
      />
    </div>
  );
}

