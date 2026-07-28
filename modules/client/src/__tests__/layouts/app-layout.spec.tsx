import { render, screen, fireEvent } from '@testing-library/react';
import AppLayout from '@/layouts/app';
import { TaskStatus, type ITask } from '@/types';

const MOCK_TASK: ITask = {
  id: '1',
  status: TaskStatus.TODO,
  title: 'Review pull request #482',
  userId: 'u1',
};

const MOCK_TASK_2: ITask = {
  id: '2',
  status: TaskStatus.TODO,
  title: 'Fix flaky test',
  userId: 'u1',
};

let mockTasks: ITask[] = [];
let mockStatus = 'idle';

jest.mock('@/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: mockTasks,
    status: mockStatus,
    error: null,
    fetchTasks: jest.fn(),
  }),
}));

beforeEach(() => {
  mockTasks = [];
  mockStatus = 'idle';
});

describe('AppLayout', () => {
  it('renders the sidebar hidden below md', () => {
    render(<AppLayout />);
    const sidebarWrapper = screen.getByText('Xeonray').closest('.hidden');
    expect(sidebarWrapper).toHaveClass('hidden', 'md:block');
  });

  it('renders tasks from the store in the task list', () => {
    mockTasks = [MOCK_TASK];
    render(<AppLayout />);
    expect(screen.getByText('Review pull request #482')).toBeInTheDocument();
  });

  it('renders a load failure message instead of the task list when fetching errored', () => {
    mockStatus = 'error';
    mockTasks = [MOCK_TASK];
    render(<AppLayout />);

    expect(screen.getByText("Couldn't load tasks")).toBeInTheDocument();
    expect(screen.queryByText('Review pull request #482')).not.toBeInTheDocument();
  });

  it('renders the timer hidden below lg', () => {
    render(<AppLayout />);
    const timerWrapper = screen.getByText('25:00').closest('.hidden');
    expect(timerWrapper).toHaveClass('hidden', 'lg:block');
  });

  it('does not render the timer task card by default', () => {
    mockTasks = [MOCK_TASK];
    render(<AppLayout />);
    expect(screen.queryByText('No sub-tasks yet')).not.toBeInTheDocument();
  });

  it('shows the timer task card with task details when the clock icon is clicked', () => {
    mockTasks = [MOCK_TASK];
    render(<AppLayout />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle task timer card' }));

    expect(screen.getByText('No sub-tasks yet')).toBeInTheDocument();
    expect(screen.getAllByText('Review pull request #482')).toHaveLength(2);
  });

  it('hides the timer task card when the same clock icon is clicked again', () => {
    mockTasks = [MOCK_TASK];
    render(<AppLayout />);

    const clockButton = screen.getByRole('button', { name: 'Toggle task timer card' });
    fireEvent.click(clockButton);
    fireEvent.click(clockButton);

    expect(screen.queryByText('No sub-tasks yet')).not.toBeInTheDocument();
  });

  it('switches the timer task card to a different task when another clock icon is clicked', () => {
    mockTasks = [MOCK_TASK, MOCK_TASK_2];
    render(<AppLayout />);

    const [firstClockButton, secondClockButton] = screen.getAllByRole('button', {
      name: 'Toggle task timer card',
    });
    fireEvent.click(firstClockButton!);
    fireEvent.click(secondClockButton!);

    expect(screen.getAllByText('Fix flaky test')).toHaveLength(2);
    expect(screen.getAllByText('Review pull request #482')).toHaveLength(1);
  });

  it('closes the timer task card when its close (X) button is clicked', () => {
    mockTasks = [MOCK_TASK];
    render(<AppLayout />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle task timer card' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close task timer card' }));

    expect(screen.queryByText('No sub-tasks yet')).not.toBeInTheDocument();
  });
});
