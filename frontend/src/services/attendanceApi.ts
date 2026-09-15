import { AttendanceMonthResponse, AttendanceResponse } from '../types/attendance';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://controlasistencia-vv41.onrender.com/api';

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${input}`, init);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message ?? 'Error en la petición');
  }

  return response.json();
}

export const attendanceApi = {
  async getMonth(year: number, month: number): Promise<AttendanceMonthResponse> {
    return fetchJson<AttendanceMonthResponse>(`/attendance?year=${year}&month=${month}`);
  },

  async createAttendance(date: string): Promise<AttendanceResponse> {
    return fetchJson<AttendanceResponse>('/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date })
    });
  },

  async deleteAttendance(date: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/attendance/${date}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message ?? 'Error al eliminar asistencia');
    }
  },

  async downloadReport(year: number, month: number, format: 'xlsx' | 'pdf'): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reports/monthly?year=${year}&month=${month}&format=${format}`);

    if (!response.ok) {
      throw new Error('Error al descargar el reporte');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asistencia-${month}-${year}.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
