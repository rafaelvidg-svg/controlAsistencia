import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { attendanceApi } from './services/attendanceApi';

vi.mock('./services/attendanceApi', () => ({
  attendanceApi: {
    getMonth: vi.fn(),
    createAttendance: vi.fn(),
    deleteAttendance: vi.fn(),
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
      dates: []
    });

    vi.mocked(attendanceApi.createAttendance).mockResolvedValue({
      id: 1,
      date: '2026-09-10'
    });

    vi.mocked(attendanceApi.deleteAttendance).mockResolvedValue(undefined);
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

    expect(attendanceApi.createAttendance).toHaveBeenCalled();
  });
});
