import { neon } from '@neondatabase/serverless';

const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL;
let sql: ReturnType<typeof neon> | undefined;
let schemaReady: Promise<void> | undefined;

export function database() {
  if (!connectionString) {
    throw new Error('Configura DATABASE_URL en Vercel con la conexión de Neon');
  }

  sql ??= neon(connectionString);
  return sql;
}

export function ensureSchema(): Promise<void> {
  const client = database();
  schemaReady ??= (async () => {
    await client`
      CREATE TABLE IF NOT EXISTS office_attendance (
        id BIGSERIAL PRIMARY KEY,
        attendance_date DATE NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await client`
      CREATE INDEX IF NOT EXISTS idx_office_attendance_date
      ON office_attendance(attendance_date)
    `;
  })();

  return schemaReady;
}
