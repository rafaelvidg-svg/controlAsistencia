import type { VercelRequest, VercelResponse } from '@vercel/node';
import { database, ensureSchema } from '../_lib/db.js';
import { getMonthData, monthBounds } from '../_lib/attendance.js';
import { handleOptions, isValidDate, parseYearMonth, sendError } from '../_lib/http.js';

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
      const { startDate, endDate } = monthBounds(params.year, params.month);
      const [monthData, settings] = await Promise.all([
        getMonthData(sql, params.year, params.month),
        sql`SELECT total_days, expiration_date::text AS expiration_date FROM office_vacation_settings WHERE id = 1`
      ]);
      const usedRows = await sql`SELECT COUNT(*) AS used_days FROM office_vacations`;
      response.status(200).json({
        dates: monthData.vacationDates,
        usedDays: Number(usedRows[0]?.used_days ?? 0),
        totalDays: Number(settings[0]?.total_days ?? 0),
        expirationDate: settings[0]?.expiration_date ? String(settings[0].expiration_date) : null,
        startDate,
        endDate
      });
      return;
    }

    if (request.method === 'PUT') {
      const totalDays = Number(request.body?.totalDays);
      const expirationDate = request.body?.expirationDate;
      if (!Number.isInteger(totalDays) || totalDays < 0 || (expirationDate !== null && !isValidDate(expirationDate))) {
        sendError(response, 400, 'Datos de vacaciones inválidos');
        return;
      }
      const rows = await sql`
        INSERT INTO office_vacation_settings (id, total_days, expiration_date)
        VALUES (1, ${totalDays}, ${expirationDate || null})
        ON CONFLICT (id) DO UPDATE SET total_days = EXCLUDED.total_days, expiration_date = EXCLUDED.expiration_date
        RETURNING total_days, expiration_date::text AS expiration_date
      `;
      const usedRows = await sql`SELECT COUNT(*) AS used_days FROM office_vacations`;
      response.status(200).json({ dates: [], usedDays: Number(usedRows[0]?.used_days ?? 0), totalDays: Number(rows[0].total_days), expirationDate: rows[0].expiration_date ? String(rows[0].expiration_date) : null });
      return;
    }

    if (request.method === 'POST') {
      const date = request.body?.date;
      if (!isValidDate(date)) {
        sendError(response, 400, 'Formato de fecha inválido. Usa YYYY-MM-DD');
        return;
      }
      const rows = await sql`
        INSERT INTO office_vacations (vacation_date)
        VALUES (${date})
        RETURNING id, vacation_date::text AS date
      `;
      response.status(201).json({ id: Number(rows[0].id), date: String(rows[0].date) });
      return;
    }

    response.setHeader('Allow', 'GET, POST, PUT, OPTIONS');
    sendError(response, 405, 'Method not allowed');
  } catch (error) {
    console.error(error);
    sendError(response, 500, error instanceof Error ? error.message : 'An unexpected error occurred');
  }
}