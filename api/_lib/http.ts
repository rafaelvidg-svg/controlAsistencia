import type { VercelRequest, VercelResponse } from '@vercel/node';

export function setCors(response: VercelResponse): void {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
}

export function handleOptions(request: VercelRequest, response: VercelResponse): boolean {
  setCors(response);
  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return true;
  }

  return false;
}

export function sendError(response: VercelResponse, status: number, message: string): void {
  response.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    error: status === 400 ? 'Bad Request' : status === 404 ? 'Not Found' : 'Internal Server Error',
    message
  });
}

export function parseYearMonth(request: VercelRequest): { year: number; month: number } | null {
  const year = Number(request.query.year);
  const month = Number(request.query.month);

  if (!Number.isInteger(year) || year < 1 || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  return { year, month };
}

export function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
