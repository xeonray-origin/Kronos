import { render, screen, fireEvent } from '@testing-library/react';
import { TimerTaskCard } from '@/components';
import { TaskStatus, type ITask } from '@/types';

const TASK: ITask = {
  id: '1',
  status: TaskStatus.BACKLOG,
  title: 'Write docs',
  description: 'Cover the API',
  userId: 'u1',
};

describe('TimerTaskCard', () => {
  it('renders task title, description, and sub-tasks empty state', () => {
    render(<TimerTaskCard task={TASK} onClose={jest.fn()} />);

    expect(screen.getByText('Write docs')).toBeInTheDocument();
    expect(screen.getByText('Cover the API')).toBeInTheDocument();
    expect(screen.getByText('No sub-tasks yet')).toBeInTheDocument();
  });

  it('omits description when not provided', () => {
    render(<TimerTaskCard task={{ ...TASK, description: undefined }} onClose={jest.fn()} />);

    expect(screen.queryByText('Cover the API')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = jest.fn();
    render(<TimerTaskCard task={TASK} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close task timer card' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
