import { useEffect, useState } from 'react';
import { supabase } from '../database/supabaseClient';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      console.log('Attempting to fetch courses...');
      console.log('Supabase client:', supabase);
      
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      
      console.log('Response data:', data);
      console.log('Response error:', error);
      
      if (error) throw error;
      
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Courses</h1>
      <p>Found {courses.length} courses</p>
      {courses.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <pre>{JSON.stringify(courses, null, 2)}</pre>
      )}
    </div>
  );
}