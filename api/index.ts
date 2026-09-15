import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCors } from './_lib/http.js';

export default function handler(_request: VercelRequest, response: VercelResponse) {
  setCors(response);
  response.status(200).json({ name: 'office-attendance', status: 'ok', basePath: '/api' });
}
