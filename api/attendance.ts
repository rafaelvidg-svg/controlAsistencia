import type { VercelRequest, VercelResponse } from '@vercel/node';
import { database, ensureSchema } from './_lib/db';
import { getMonthData } from './_lib/attendance';
import { handleOptions, isValidDate, parseYearMonth, sendError } from './_lib/http';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (handleOptions(request, response)) return;

  try {
    await ensureSchema();
    const sql = database();

    if (request.method === 'GET') {
      const params = parseYearMonth(request);
      if (!params) {
        sendError(response, 400, 'Parámetros de año y mes inválidos');
        return;
      }

      response.status(200).json(await getMonthData(sql, params.year, params.month));
      return;
    }

    if (request.method === 'POST') {
      const date = request.body?.date;
      if (!isValidDate(date)) {
        sendError(response, 400, 'Formato de fecha inválido. Usa YYYY-MM-DD');
        return;
      }

      try {
        const rows = await sql`
          INSERT INTO office_attendance (attendance_date)
          VALUES (${date})
          RETURNING id, attendance_date::text AS date
        `;
        response.status(201).json({ id: Number(rows[0].id), date: String(rows[0].date) });
      } catch (error) {
        if (isUniqueViolation(error)) {
          sendError(response, 409, 'Attendance already exists for this date');
          return;
        }
        throw error;
      }
      return;
    }

    response.setHeader('Allow', 'GET, POST, OPTIONS');
    sendError(response, 405, 'Method not allowed');
  } catch (error) {
    console.error(error);
    sendError(response, 500, 'An unexpected error occurred');
  }
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}
