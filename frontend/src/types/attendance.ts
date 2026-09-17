export interface AttendanceMonthResponse {
  year: number;
  month: number;
  goal: number;
  attendedDays: number;
  remainingDays: number;
  percentage: number;
  dates: string[];
  vacationDates: string[];
}

export interface VacationSettings {
  dates: string[];
  usedDays: number;
  totalDays: number;
  expirationDate: string | null;
}

export interface AttendanceResponse {
  id: number;
  date: string;
}
