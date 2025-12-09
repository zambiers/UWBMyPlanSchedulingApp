import { useEffect, useMemo, useState } from 'react';
import { fetchTableData } from '../database/dataService';

export default function DataTable({ tableKey, title, description }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchTableData(tableKey)
      .then((data) => {
        if (isMounted) {
          setRows(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to load data');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [tableKey]);

  const columns = useMemo(() => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]);
  }, [rows]);

  return (
    <section className="panel">
      <div className="panel-header">
        <h1>{title}</h1>
        <div className="row-count">{rows.length} rows</div>
      </div>
      {description && <p className="muted">{description}</p>}

      {loading && <p>Loading...</p>}
      {!loading && error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <>
          {rows.length === 0 ? (
            <p>No data found.</p>
          ) : (
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
                  {rows.map((row, rowIndex) => (
                    <tr key={row.id || rowIndex}>
                      {columns.map((col) => (
                        <td key={col}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}

