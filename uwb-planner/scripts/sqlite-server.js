const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const rootDir = path.resolve(__dirname, '..');
const dbPath = process.env.SQLITE_DB_PATH
  ? path.resolve(rootDir, process.env.SQLITE_DB_PATH)
  : path.join(rootDir, 'data', 'local-sqlite.db');
const resetOnStart = String(process.env.SQLITE_RESET || '').toLowerCase() === 'true';
const port = Number(process.env.API_PORT) || 4000;

const schemaFile = path.join(rootDir, 'src', 'database', 'courseScheduler.session.sql');
const dataFile = path.join(rootDir, 'src', 'database', 'dataInsertion.sql');
const allowedTables = [
  'students',
  'professors',
  'courses',
  'section',
  'degreeprogram',
  'studentsection',
  'studentdegreeprogram',
];

function prepareDatabase() {
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
  const schemaSql = fs.readFileSync(schemaFile, 'utf8');
  const dataSql = fs.readFileSync(dataFile, 'utf8');

  db.exec(schemaSql);
  db.exec(dataSql);
  db.close();
  console.log(`[sqlite] Database ready at ${dbPath}${resetOnStart ? ' (recreated)' : ''}`);
}

prepareDatabase();

const db = new Database(dbPath, { readonly: false });
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbPath, resetOnStart });
});

app.get('/api/:table', (req, res) => {
  const table = String(req.params.table || '').toLowerCase();
  if (!allowedTables.includes(table)) {
    res.status(404).json({ error: 'Unknown table' });
    return;
  }

  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    res.json(rows);
  } catch (error) {
    console.error(`[sqlite] Failed to read from ${table}:`, error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`[sqlite] API listening on http://localhost:${port}`);
});

