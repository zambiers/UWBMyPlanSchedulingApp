const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const rootDir = path.resolve(__dirname, '..');
const defaultDbPath = path.join(rootDir, 'data', 'local-sqlite.db');

const dbPath = process.env.SQLITE_DB_PATH
  ? path.resolve(rootDir, process.env.SQLITE_DB_PATH)
  : defaultDbPath;
const resetOnStart = String(process.env.SQLITE_RESET || '').toLowerCase() === 'true';

function loadSqlFile(filename) {
  const filePath = path.join(rootDir, 'src', 'database', filename);
  return fs.readFileSync(filePath, 'utf8');
}

function initializeDatabase() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (resetOnStart && fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  if (fs.existsSync(dbPath) && !resetOnStart) {
    console.log(`[sqlite] Using existing database at ${dbPath}`);
    return;
  }

  const db = new Database(dbPath);
  const schemaSql = loadSqlFile('courseScheduler.session.sql');
  const dataSql = loadSqlFile('dataInsertion.sql');

  db.exec(schemaSql);
  db.exec(dataSql);
  db.close();

  console.log(`[sqlite] Database ready at ${dbPath}${resetOnStart ? ' (recreated)' : ''}`);
}

initializeDatabase();

