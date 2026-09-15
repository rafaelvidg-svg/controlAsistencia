import type { VercelRequest, VercelResponse } from '@vercel/node';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { database, ensureSchema } from '../_lib/db.js';
import { getMonthData, monthBounds } from '../_lib/attendance.js';
import { handleOptions, parseYearMonth, sendError } from '../_lib/http.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (handleOptions(request, response)) return;
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET, OPTIONS');
    sendError(response, 405, 'Method not allowed');
    return;
  }

  const params = parseYearMonth(request);
  const format = request.query.format;
  if (!params || (format !== 'xlsx' && format !== 'pdf')) {
    sendError(response, 400, 'Parámetros inválidos. Usa year, month y format=xlsx|pdf');
    return;
  }

  try {
    await ensureSchema();
    const sql = database();
    const summary = await getMonthData(sql, params.year, params.month);
    const { startDate, endDate } = monthBounds(params.year, params.month);
    const records = await sql`
      SELECT attendance_date::text AS date
      FROM office_attendance
      WHERE attendance_date BETWEEN ${startDate} AND ${endDate}
      ORDER BY attendance_date ASC
    `;
    const dates = records.map((record) => String(record.date));
    const fileName = `asistencia-${params.month}-${params.year}.${format}`;

    if (format === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Asistencia');
      sheet.addRows([
        ['Mes', 'Año', 'Objetivo', 'Días asistidos', 'Días restantes', 'Porcentaje'],
        [summary.month, summary.year, summary.goal, summary.attendedDays, summary.remainingDays, summary.percentage],
        ['Lista de fechas']
      ]);
      dates.forEach((date) => sheet.addRow([date]));
      const buffer = await workbook.xlsx.writeBuffer();
      response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      response.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      response.status(200).send(Buffer.from(buffer));
      return;
    }

    const buffer = await createPdf(summary, dates);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    response.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    sendError(response, 500, 'Error al generar el reporte');
  }
}

function createPdf(summary: Awaited<ReturnType<typeof getMonthData>>, dates: string[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ size: 'A4' });
    const chunks: Buffer[] = [];
    document.on('data', (chunk: Buffer) => chunks.push(chunk));
    document.on('end', () => resolve(Buffer.concat(chunks)));
    document.on('error', reject);
    document.fontSize(18).text('REPORTE DE ASISTENCIA A OFICINA');
    document.moveDown();
    document.fontSize(11).text(`Mes: ${summary.month}/${summary.year}`);
    document.text(`Objetivo mensual: ${summary.goal} días`);
    document.text(`Días asistidos: ${summary.attendedDays}`);
    document.text(`Días restantes: ${summary.remainingDays}`);
    document.text(`Porcentaje de cumplimiento: ${summary.percentage.toFixed(2)}%`);
    document.moveDown();
    document.fontSize(12).text('DÍAS DE ASISTENCIA');
    document.fontSize(11);
    dates.forEach((date) => document.text(date));
    document.end();
  });
}
