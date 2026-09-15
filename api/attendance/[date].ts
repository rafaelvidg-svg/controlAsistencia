import type { VercelRequest, VercelResponse } from '@vercel/node';
import { database, ensureSchema } from '../_lib/db.js';
import { handleOptions, isValidDate, sendError } from '../_lib/http.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (handleOptions(request, response)) return;

  if (request.method !== 'DELETE') {
    response.setHeader('Allow', 'DELETE, OPTIONS');
    sendError(response, 405, 'Method not allowed');
    return;
  }

  const date = request.query.date;
  if (!isValidDate(date)) {
    sendError(response, 400, 'Formato de fecha inválido. Usa YYYY-MM-DD');
    return;
  }

  try {
    await ensureSchema();
    const sql = database();
    const rows = await sql`
      DELETE FROM office_attendance
      WHERE attendance_date = ${date}
      RETURNING id
    `;

    if (rows.length === 0) {
      sendError(response, 404, `Attendance not found for date: ${date}`);
      return;
    }

    response.status(204).end();
  } catch (error) {
    console.error(error);
    sendError(response, 500, 'An unexpected error occurred');
  }
}
