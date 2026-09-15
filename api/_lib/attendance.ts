import type { NeonQueryFunction } from '@neondatabase/serverless';

export const MONTHLY_GOAL = 12;

export function monthBounds(year: number, month: number): { startDate: string; endDate: string } {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
}

export async function getMonthData(sql: NeonQueryFunction<false, false>, year: number, month: number) {
  const { startDate, endDate } = monthBounds(year, month);
  const rows = await sql`
    SELECT attendance_date::text AS date
    FROM office_attendance
    WHERE attendance_date BETWEEN ${startDate} AND ${endDate}
    ORDER BY attendance_date ASC
  `;
  const dates = rows.map((row) => String(row.date));
  const attendedDays = dates.length;

  return {
    year,
    month,
    goal: MONTHLY_GOAL,
    attendedDays,
    remainingDays: Math.max(0, MONTHLY_GOAL - attendedDays),
    percentage: MONTHLY_GOAL === 0 ? 0 : (attendedDays / MONTHLY_GOAL) * 100,
    dates
  };
}
