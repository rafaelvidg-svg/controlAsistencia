export interface AttendanceMonthResponse {
  year: number;
  month: number;
  goal: number;
  attendedDays: number;
  remainingDays: number;
  percentage: number;
  dates: string[];
}

export interface AttendanceResponse {
  id: number;
  date: string;
}
