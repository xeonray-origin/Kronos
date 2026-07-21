import { render, screen, fireEvent, act } from '@testing-library/react';
import { Timer } from '@/components/timer';

describe('Timer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders default time and label', () => {
    render(<Timer />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText('FOCUS')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('renders custom initialMinutes and label', () => {
    render(<Timer initialMinutes={5} label="BREAK" />);
    expect(screen.getByText('05:00')).toBeInTheDocument();
    expect(screen.getByText('BREAK')).toBeInTheDocument();
  });

  it('starts countdown when Start is clicked', () => {
    render(<Timer />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('24:57')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('stops countdown when Pause is clicked', () => {
    render(<Timer />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    fireEvent.click(screen.getByRole('button', { name: /pause/i }));
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText('24:58')).toBeInTheDocument();
  });

  it('stops at 00:00 and clicking Start again is a no-op', () => {
    render(<Timer initialMinutes={1} />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    act(() => {
      jest.advanceTimersByTime(61000);
    });
    expect(screen.getByText('00:00')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('renders a Clear button alongside Start', () => {
    render(<Timer />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('resets to the initial time when Clear is clicked while idle', () => {
    render(<Timer initialMinutes={5} />);
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.getByText('05:00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('stops the countdown and resets to the initial time when Clear is clicked while running', () => {
    render(<Timer initialMinutes={5} />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.getByText('05:00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('resets to the initial time when Clear is clicked after the timer reaches 00:00', () => {
    render(<Timer initialMinutes={1} />);
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    act(() => {
      jest.advanceTimersByTime(61000);
    });
    expect(screen.getByText('00:00')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.getByText('01:00')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('00:57')).toBeInTheDocument();
  });
});
