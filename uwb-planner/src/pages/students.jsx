import { useEffect, useState } from 'react';
import { supabase } from '../database/supabaseClient';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('students')   // your table name
        .select('*');       // get all columns

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        setStudents(data);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Students</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            {students.length > 0 &&
              Object.keys(students[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              {Object.values(student).map((val, i) => (
                <td key={i}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
