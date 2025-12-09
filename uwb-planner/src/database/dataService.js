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

