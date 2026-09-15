import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { attendanceApi } from './services/attendanceApi';
import { AttendanceMonthResponse } from './types/attendance';
import { getCalendarDays, getMonthLabel, getNextMonth, getPreviousMonth, isCurrentMonthDay, isDateToday } from './utils/dateUtils';

const MONTHLY_GOAL = 12;

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState<AttendanceMonthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    void loadMonth(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const loadMonth = async (date: Date) => {
    setLoading(true);
    setError(null);

    try {
      const response = await attendanceApi.getMonth(date.getFullYear(), date.getMonth() + 1);
      setMonthData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el mes');
    } finally {
      setLoading(false);
    }
  };

  const calendarDays = useMemo(() => getCalendarDays(currentDate), [currentDate]);
  const attendedDates = useMemo(() => new Set(monthData?.dates ?? []), [monthData]);

  const handleDayClick = async (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');

    try {
      if (attendedDates.has(dateString)) {
        await attendanceApi.deleteAttendance(dateString);
        setToast('Asistencia eliminada');
      } else {
        await attendanceApi.createAttendance(dateString);
        setToast('✓ Asistencia registrada');
      }

      await loadMonth(currentDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la operación');
    }
  };

  const handleDownload = async (format: 'xlsx' | 'pdf') => {
    try {
      await attendanceApi.downloadReport(currentDate.getFullYear(), currentDate.getMonth() + 1, format);
      setToast(`Reporte descargado (${format.toUpperCase()})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al descargar');
    }
  };

  const progressPercentage = monthData ? monthData.percentage : 0;
  const progressBlocks = Array.from({ length: 10 }, (_, index) => index < Math.min(10, Math.round(progressPercentage / 10)));
  const monthlyGoal = monthData?.goal ?? MONTHLY_GOAL;

  const stats = monthData
    ? [
        { label: 'Asistidos', value: monthData.attendedDays, tone: 'primary' },
        { label: 'Faltan', value: monthData.remainingDays, tone: 'muted' },
        { label: 'Cumplimiento', value: `${monthData.percentage.toFixed(1)}%`, tone: 'accent' }
      ]
    : [];

  return (
    <div className="app-shell">
      <div className="container">
        <header className="topbar">
          <div className="brand-block">
            <div className="brand-mark">OA</div>
            <div>
              <p className="eyebrow">Office Attendance</p>
              <h1>{getMonthLabel(currentDate)}</h1>
            </div>
          </div>

          <div className="topbar-controls">
            <button onClick={() => setCurrentDate(getPreviousMonth(currentDate))} aria-label="Mes anterior" className="nav-button">
              ‹
            </button>
            <button onClick={() => setCurrentDate(getNextMonth(currentDate))} aria-label="Mes siguiente" className="nav-button">
              ›
            </button>
          </div>
        </header>

        <div className="toolbar">
          <button className="primary-action" onClick={() => setCurrentDate(new Date())}>
            Hoy
          </button>
          <button className="secondary-action" onClick={() => handleDownload('xlsx')}>
            Descargar Excel
          </button>
          <button className="secondary-action" onClick={() => handleDownload('pdf')}>
            Descargar PDF
          </button>
        </div>

        {error && <div className="alert">{error}</div>}

        <main className="content-grid">
          <section className="calendar-panel">
            <div className="panel-header">
              <div>
                <p className="label-title">Calendario</p>
                <h2>Registro mensual</h2>
              </div>
              <div className="legend">
                <span>
                  <i className="legend-dot dot-attended" />
                  Asistido
                </span>
                <span>
                  <i className="legend-dot dot-today" />
                  Hoy
                </span>
              </div>
            </div>

            <div className="weekdays" aria-label="Días de la semana">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((day) => {
                const formatted = format(day, 'yyyy-MM-dd');
                const isAttended = attendedDates.has(formatted);
                const isCurrentMonth = isCurrentMonthDay(day, currentDate);
                const isToday = isDateToday(day);

                return (
                  <button
                    key={formatted}
                    className={['day-cell', isAttended ? 'attended' : '', isCurrentMonth ? '' : 'muted', isToday ? 'today' : ''].filter(Boolean).join(' ')}
                    onClick={() => handleDayClick(day)}
                    aria-label={`Día ${formatted}`}
                    aria-pressed={isAttended}
                  >
                    <span>{format(day, 'd')}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="summary-panel">
            <div className="panel-header panel-header-stack">
              <div>
                <p className="label-title">Resumen</p>
                <h2>Asistencia del mes</h2>
              </div>
            </div>

            {loading && !monthData ? (
              <div className="empty-state">Cargando...</div>
            ) : monthData ? (
              <>
                <div className="stats-grid">
                  {stats.map((item) => (
                    <div key={item.label} className={`stat-card ${item.tone}`}>
                      <span className="label">{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="progress-wrap">
                  <div className="progress-header">
                    <span>Objetivo</span>
                    <strong>
                      {monthData.attendedDays >= monthlyGoal
                        ? `🎉 Meta cumplida`
                        : `${monthData.attendedDays} / ${monthlyGoal} días`}
                    </strong>
                  </div>
                  <div className="progress-bar" aria-label="Progreso mensual">
                    {progressBlocks.map((active, index) => (
                      <span key={index} className={active ? 'filled' : 'empty'} />
                    ))}
                  </div>
                  <div className="progress-text">
                    {monthData.attendedDays >= monthlyGoal
                      ? `${monthData.attendedDays} de ${monthlyGoal} días registrados`
                      : `${monthData.attendedDays} de ${monthlyGoal} días registrados`}
                  </div>
                </div>

                <div className="history">
                  <h3>Historial</h3>
                  <ul>
                    {monthData.dates.length > 0 ? (
                      monthData.dates.map((date) => (
                        <li key={date}>{format(new Date(date), 'dd/MM/yyyy')}</li>
                      ))
                    ) : (
                      <li className="empty-list">Sin asistencias registradas</li>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <div className="empty-state">No hay datos disponibles</div>
            )}
          </aside>
        </main>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
