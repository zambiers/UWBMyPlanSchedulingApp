import { useCallback, useEffect, useMemo, useState } from 'react';
import { createRecord, deleteRecord, fetchTableData, updateRecord } from '../database/dataService';

function Field({ field, value, onChange }) {
  return (
    <div className="form-row">
      <label>{field.label}</label>
      {field.options ? (
        <select value={value} onChange={(e) => onChange(field.name, e.target.value)}>
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type || 'text'}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      )}
    </div>
  );
}

function Table({ rows, columns, onDelete }) {
  if (!rows || rows.length === 0) {
    return <p>No records yet.</p>;
  }
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            {onDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{row[col] ?? row[col.toLowerCase()] ?? row[col.toUpperCase()] ?? ''}</td>
              ))}
              {onDelete && (
                <td>
                  <button onClick={() => onDelete(row)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CrudSection({ title, description, tableKey, fields, primaryKey }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const columns = useMemo(() => {
    if (rows.length === 0) return fields.map((f) => f.label);
    return Object.keys(rows[0]);
  }, [fields, rows]);

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTableData(tableKey);
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [tableKey]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    const payload = {};
    fields.forEach((field) => {
      if (form[field.name] !== undefined && form[field.name] !== '') {
        payload[field.name] = field.type === 'number' ? Number(form[field.name]) : form[field.name];
      }
    });
    return payload;
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      await createRecord(tableKey, buildPayload());
      setInfo('Record created.');
      await loadRows();
    } catch (err) {
      setError(err.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const payload = buildPayload();
    const missing = primaryKey.filter((key) => payload[key] === undefined || payload[key] === '');
    if (missing.length > 0) {
      setError(`Missing primary key fields: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setInfo('');
    try {
      await updateRecord(tableKey, payload);
      setInfo('Record updated.');
      await loadRows();
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    const payload = {};
    primaryKey.forEach((key) => {
      const matchKey = Object.keys(row).find((k) => k.toLowerCase() === key.toLowerCase());
      if (matchKey) {
        payload[key] = row[matchKey];
      }
    });
    setLoading(true);
    setError('');
    setInfo('');
    try {
      await deleteRecord(tableKey, payload);
      setInfo('Record deleted.');
      await loadRows();
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subpanel">
      <div className="panel-header">
        <h2>{title}</h2>
        <div className="row-count">{rows.length} rows</div>
      </div>
      {description && <p className="muted">{description}</p>}

      <div className="form-grid">
        {fields.map((field) => (
          <Field key={field.name} field={field} value={form[field.name] || ''} onChange={setField} />
        ))}
      </div>

      <div className="button-row">
        <button onClick={handleCreate} disabled={loading}>
          Create
        </button>
        <button onClick={handleUpdate} disabled={loading}>
          Update
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}
      {info && <div className="info">{info}</div>}

      <Table rows={rows} columns={columns} onDelete={handleDelete} />
    </div>
  );
}

export default function AdminPortal() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h1>Admin Portal</h1>
      </div>
      <p className="muted">
        Manage core records: students, professors, courses, sections, degree programs, and student-degree assignments.
      </p>

      <CrudSection
        title="Students"
        description="Create, update, or remove students."
        tableKey="students"
        primaryKey={['studentid']}
        fields={[
          { name: 'studentid', label: 'Student ID', placeholder: 'e.g. 8952211', type: 'number' },
          { name: 'firstname', label: 'First Name' },
          { name: 'lastname', label: 'Last Name' },
          { name: 'major', label: 'Major' },
          { name: 'email', label: 'Email', type: 'email' },
        ]}
      />

      <CrudSection
        title="Professors"
        description="Manage professors and teaching assignments."
        tableKey="professors"
        primaryKey={['employeeid']}
        fields={[
          { name: 'employeeid', label: 'Employee ID', type: 'number', placeholder: 'e.g. 12' },
          { name: 'firstname', label: 'First Name' },
          { name: 'lastname', label: 'Last Name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'majorofinstruction', label: 'Major of Instruction' },
        ]}
      />

      <CrudSection
        title="Courses"
        description="Create or edit courses."
        tableKey="courses"
        primaryKey={['coursecode']}
        fields={[
          { name: 'coursecode', label: 'Course Code', placeholder: 'e.g. B BUS 101' },
          { name: 'coursename', label: 'Course Name' },
          { name: 'credits', label: 'Credits', type: 'number' },
          { name: 'major', label: 'Major' },
          { name: 'description', label: 'Description' },
        ]}
      />

      <CrudSection
        title="Course Sections"
        description="Set section details, capacity, and instructor assignments."
        tableKey="sections"
        primaryKey={['coursecode', 'sectionletter', 'meetingday', 'starttime']}
        fields={[
          { name: 'coursecode', label: 'Course Code', placeholder: 'e.g. B BUS 101' },
          { name: 'sectionletter', label: 'Section Letter', placeholder: 'A' },
          { name: 'meetingday', label: 'Meeting Day', placeholder: 'Mon/Wed' },
          { name: 'starttime', label: 'Start Time', placeholder: '09:00' },
          { name: 'endtime', label: 'End Time', placeholder: '10:30' },
          { name: 'roomnum', label: 'Room Number', placeholder: 'UW1 101' },
          { name: 'maxenrolled', label: 'Max Enrolled', type: 'number' },
          { name: 'enrolledstudents', label: 'Enrolled Students', type: 'number' },
          { name: 'instructor', label: 'Instructor (Employee ID)', type: 'number' },
        ]}
      />

      <CrudSection
        title="Degree Programs"
        description="Add or edit degree programs."
        tableKey="programs"
        primaryKey={['degreename']}
        fields={[
          { name: 'degreename', label: 'Degree Name' },
          {
            name: 'degreetype',
            label: 'Degree Type',
            options: [
              { value: 'Major', label: 'Major' },
              { value: 'Minor', label: 'Minor' },
            ],
          },
          { name: 'schooldivision', label: 'School Division' },
          { name: 'enrolledstudentsmax', label: 'Max Students', type: 'number' },
          { name: 'description', label: 'Description' },
        ]}
      />

      {/* <CrudSection
        title="Student Degree Assignments"
        description="Assign or remove students from degree programs."
        tableKey="student-degrees"
        primaryKey={['studentid', 'degreename']}
        fields={[
          { name: 'studentid', label: 'Student ID', type: 'number' },
          { name: 'degreename', label: 'Degree Name' },
        ]}
      /> */}
    </div>
  );
}
