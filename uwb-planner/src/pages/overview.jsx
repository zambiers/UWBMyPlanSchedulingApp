import { getDataSource } from '../database/dataService';
import { Link } from 'react-router-dom';

const dataSource = getDataSource();

export default function Home() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h1>UWB Planner</h1>
      </div>
      <p className="muted">Data source: {dataSource === 'sqlite' ? 'Local SQLite API' : 'Supabase'}</p>
      <p>Use the navigation links above to browse each table. Styling is intentionally minimal so it is easy to read the data.</p>
      <div className="button-row" style={{ marginTop: '12px' }}>
        <Link className="button-link" to="/student">
          Open Student Portal
        </Link>
        <Link className="button-link" to="/professor">
          Open Professor Portal
        </Link>
        <Link className="button-link" to="/admin">
          Open Admin Portal
        </Link>
        <a className="button-link" href="#/sample-queries">
          View Sample Queries
        </a>
      </div>
    </section>
  );
}
