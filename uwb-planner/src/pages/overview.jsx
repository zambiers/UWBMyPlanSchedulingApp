import { getDataSource } from '../database/dataService';

const dataSource = getDataSource();

export default function Home() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h1>UWB Planner</h1>
      </div>
      <p className="muted">
        Data source: {dataSource === 'sqlite' ? 'Local SQLite API' : 'Supabase'}
      </p>
      <p>
        Use the navigation links above to browse each table. Styling is intentionally
        minimal so it is easy to read the data.
      </p>
    </section>
  );
}
