import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker, formatDatePickerValue } from '@/components/date-picker';

describe('DatePicker', () => {
  const open = () => fireEvent.click(document.querySelector('[aria-haspopup]')!);
  const day = (date: Date) => document.querySelector(`[data-day="${date.toLocaleDateString()}"]`)!;

  it('renders the default placeholder when no value is set', () => {
    render(<DatePicker onChange={jest.fn()} />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('renders a custom placeholder and opens the calendar on click', () => {
    render(<DatePicker onChange={jest.fn()} placeholder="Choose date" />);
    fireEvent.click(screen.getByText('Choose date'));
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('selects a day and emits a Date at midnight when no time is set', () => {
    const onChange = jest.fn();
    render(<DatePicker value={new Date(2026, 6, 15)} onChange={onChange} />);
    open();

    fireEvent.click(day(new Date(2026, 6, 20)));

    const emitted = onChange.mock.calls[0][0] as Date;
    expect(emitted.getFullYear()).toBe(2026);
    expect(emitted.getMonth()).toBe(6);
    expect(emitted.getDate()).toBe(20);
    expect(emitted.getHours()).toBe(0);
    expect(emitted.getMinutes()).toBe(0);
  });

  it('clears the value when the selected day is toggled off', () => {
    const onChange = jest.fn();
    render(<DatePicker value={new Date(2026, 6, 15)} onChange={onChange} />);
    open();

    fireEvent.click(day(new Date(2026, 6, 15)));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('merges a chosen time into the date', () => {
    const onChange = jest.fn();
    render(<DatePicker value={new Date(2026, 6, 15)} onChange={onChange} />);
    open();

    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '14:30' } });

    const emitted = onChange.mock.calls[0][0] as Date;
    expect(emitted.getHours()).toBe(14);
    expect(emitted.getMinutes()).toBe(30);
  });

  it('resets the time to midnight when the time input is cleared', () => {
    const onChange = jest.fn();
    render(<DatePicker value={new Date(2026, 6, 15, 14, 30)} onChange={onChange} />);
    open();

    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '' } });

    const emitted = onChange.mock.calls[0][0] as Date;
    expect(emitted.getHours()).toBe(0);
    expect(emitted.getMinutes()).toBe(0);
  });

  it('allows selecting midnight (00:00) as an explicit time', () => {
    render(<DatePicker value={new Date(2026, 6, 15)} onChange={jest.fn()} />);
    open();

    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '00:00' } });
    expect(screen.getByText(/Jul 15, 2026 12:00 AM/)).toBeInTheDocument();
  });

  it('ignores time changes while no date is selected', () => {
    const onChange = jest.fn();
    render(<DatePicker onChange={onChange} />);
    open();

    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '09:00' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('clears the value via the clear button', () => {
    const onChange = jest.fn();
    render(<DatePicker value={new Date(2026, 6, 15)} onChange={onChange} />);

    const clear = screen.getByRole('button', { name: 'Clear date' });
    fireEvent.pointerDown(clear);
    fireEvent.click(clear);
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('formats the label as date only when no time is set', () => {
    render(<DatePicker value={new Date(2026, 6, 15)} onChange={jest.fn()} />);
    expect(screen.getByText('Jul 15, 2026')).toBeInTheDocument();
  });

  it('formats the label as date + time when a time is present', () => {
    render(<DatePicker value={new Date(2026, 6, 15, 14, 30)} onChange={jest.fn()} />);
    expect(screen.getByText(/Jul 15, 2026 2:30 PM/)).toBeInTheDocument();
  });

  it('formats a value with a time for consumers', () => {
    expect(formatDatePickerValue(new Date(2026, 6, 15, 14, 30))).toBe('Jul 15, 2026 2:30 PM');
  });
});
