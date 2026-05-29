import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'mi-scout.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  // Ensure the data directory exists
  const fs = require('fs');
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  initSchema(_db);

  return _db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS partidos (
      id                          TEXT PRIMARY KEY,
      fecha                       TEXT NOT NULL,
      visitante                   TEXT NOT NULL,
      local                       TEXT NOT NULL,
      descripcion                 TEXT NOT NULL,
      innings                     INTEGER NOT NULL DEFAULT 7,
      creado_en                   TEXT NOT NULL,
      finalizado                  INTEGER NOT NULL DEFAULT 0,
      indice_visitante            INTEGER NOT NULL DEFAULT 0,
      indice_local                INTEGER NOT NULL DEFAULT 0,
      mitad_inning                TEXT NOT NULL DEFAULT 'alta',
      inning_actual               INTEGER NOT NULL DEFAULT 1,
      vueltas_al_orden_visitante  INTEGER NOT NULL DEFAULT 0,
      vueltas_al_orden_local      INTEGER NOT NULL DEFAULT 0,
      perspectiva_zona            TEXT NOT NULL DEFAULT 'catcher'
    );

    CREATE TABLE IF NOT EXISTS bateadores (
      id                    TEXT PRIMARY KEY,
      partido_id            TEXT NOT NULL REFERENCES partidos(id) ON DELETE CASCADE,
      orden                 INTEGER NOT NULL,
      numero                TEXT NOT NULL,
      apellido              TEXT NOT NULL,
      nombre                TEXT NOT NULL DEFAULT '',
      equipo                TEXT NOT NULL,
      lado_bateo            TEXT NOT NULL DEFAULT 'D',
      activo                INTEGER NOT NULL DEFAULT 1,
      es_abridor            INTEGER NOT NULL DEFAULT 1,
      reemplazado_por_id    TEXT,
      reemplazado_a_inning  INTEGER,
      rol                   TEXT NOT NULL DEFAULT 'visitante'
    );

    CREATE TABLE IF NOT EXISTS turnos_al_bate (
      id              TEXT PRIMARY KEY,
      bateador_id     TEXT NOT NULL REFERENCES bateadores(id) ON DELETE CASCADE,
      partido_id      TEXT NOT NULL REFERENCES partidos(id) ON DELETE CASCADE,
      inning          INTEGER NOT NULL,
      zona            INTEGER NOT NULL,
      coordenadas_x   REAL,
      coordenadas_y   REAL,
      tipo_pitch      TEXT NOT NULL,
      resultado       TEXT NOT NULL,
      detalle_out     TEXT,
      detalle_hit     TEXT,
      timestamp       TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_bateadores_partido ON bateadores(partido_id);
    CREATE INDEX IF NOT EXISTS idx_turnos_partido ON turnos_al_bate(partido_id);
    CREATE INDEX IF NOT EXISTS idx_turnos_bateador ON turnos_al_bate(bateador_id);
    CREATE INDEX IF NOT EXISTS idx_bateadores_identidad ON bateadores(apellido, numero, equipo);
  `);
}
