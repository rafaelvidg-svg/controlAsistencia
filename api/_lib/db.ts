import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está configurada');
}

const sql = neon(connectionString);
let schemaReady: Promise<void> | undefined;

export function database() {
  return sql;
}

export function ensureSchema(): Promise<void> {
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS office_attendance (
        id BIGSERIAL PRIMARY KEY,
        attendance_date DATE NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_office_attendance_date
      ON office_attendance(attendance_date)
    `;
  })();

  return schemaReady;
}
