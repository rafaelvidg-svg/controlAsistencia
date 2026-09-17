import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { attendanceApi } from './services/attendanceApi';

vi.mock('./services/attendanceApi', () => ({
  attendanceApi: {
    getMonth: vi.fn(),
    getVacationSettings: vi.fn(),
    createAttendance: vi.fn(),
    deleteAttendance: vi.fn(),
    createVacation: vi.fn(),
    deleteVacation: vi.fn(),
    updateVacationSettings: vi.fn(),
    downloadReport: vi.fn()
  }
}));

describe('App', () => {
  beforeEach(() => {
    vi.mocked(attendanceApi.getMonth).mockResolvedValue({
      year: 2026,
      month: 9,
      goal: 12,
      attendedDays: 0,
      remainingDays: 12,
      percentage: 0,
      dates: [],
      vacationDates: []
    });
    vi.mocked(attendanceApi.getVacationSettings).mockResolvedValue({ dates: [], usedDays: 0, totalDays: 10, expirationDate: '2026-12-31' });

    vi.mocked(attendanceApi.createAttendance).mockResolvedValue({
      id: 1,
      date: '2026-09-10'
    });

    vi.mocked(attendanceApi.deleteAttendance).mockResolvedValue(undefined);
    vi.mocked(attendanceApi.createVacation).mockResolvedValue({ id: 2, date: '2026-09-10' });
    vi.mocked(attendanceApi.deleteVacation).mockResolvedValue(undefined);
    vi.mocked(attendanceApi.updateVacationSettings).mockResolvedValue({ dates: [], usedDays: 0, totalDays: 10, expirationDate: '2026-12-31' });
    vi.mocked(attendanceApi.downloadReport).mockResolvedValue(undefined);
  });

  it('renders the current month title', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: /september 2026/i })).toBeInTheDocument();
  });

  it('shows report buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /descargar excel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /descargar pdf/i })).toBeInTheDocument();
  });

  it('can toggle attendance on a day when clicking', async () => {
    const user = userEvent.setup();
    render(<App />);

    const dayButton = (await screen.findAllByRole('button', { name: /día/i }))[0];
    await user.click(dayButton);
    await user.click(screen.getByRole('button', { name: 'Asistencia' }));
    await user.click(dayButton);
    await user.click(screen.getByRole('button', { name: 'Asistencia' }));
    await user.click(dayButton);
    await user.click(screen.getByRole('button', { name: 'Asistencia' }));

    expect(attendanceApi.createAttendance).toHaveBeenCalledTimes(2);
    expect(attendanceApi.deleteAttendance).toHaveBeenCalledTimes(1);
  });

  it('can register a vacation from the day choice dialog', async () => {
    const user = userEvent.setup();
    render(<App />);

    const dayButton = (await screen.findAllByRole('button', { name: /día/i }))[0];
    await user.click(dayButton);
    await user.click(screen.getByRole('button', { name: 'Vacación' }));
    await user.click(dayButton);
    await user.click(screen.getByRole('button', { name: 'Vacación' }));
    await user.click(dayButton);
    await user.click(screen.getByRole('button', { name: 'Vacación' }));

    expect(attendanceApi.createVacation).toHaveBeenCalledTimes(2);
    expect(attendanceApi.deleteVacation).toHaveBeenCalledTimes(1);
  });

  it('shows the remaining vacation balance', async () => {
    const user = userEvent.setup();
    vi.mocked(attendanceApi.getVacationSettings).mockResolvedValue({ dates: [], usedDays: 1, totalDays: 10, expirationDate: '2026-12-31' });
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'Vacaciones' }));

    expect(await screen.findByText('Faltan 9 días de vacaciones')).toBeInTheDocument();
  });
});
