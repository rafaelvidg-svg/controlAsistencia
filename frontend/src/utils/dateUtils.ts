import { endOfMonth, endOfWeek, format, isSameMonth, isToday, startOfMonth, startOfWeek, eachDayOfInterval, addMonths, subMonths } from 'date-fns';

export function getCalendarDays(currentDate: Date): Date[] {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function getMonthLabel(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function isCurrentMonthDay(day: Date, currentMonth: Date): boolean {
  return isSameMonth(day, currentMonth);
}

export function isDateToday(day: Date): boolean {
  return isToday(day);
}

export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}
