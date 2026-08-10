import { render, screen, fireEvent, within } from '@testing-library/react';
import AppLayout from '@/layouts/app';
import { TaskStatus, type ITask } from '@/types';

const MOCK_TASK: ITask = {
  id: '1',
  status: TaskStatus.BACKLOG,
  title: 'Review pull request #482',
  userId: 'u1',
};

const MOCK_TASK_2: ITask = {
  id: '2',
  status: TaskStatus.BACKLOG,
  title: 'Fix flaky test',
  userId: 'u1',
};

let mockTasks: ITask[] = [];
let mockStatus = 'idle';
let mockActiveLabel: string | null = null;
const mockSelectLabel = jest.fn();

jest.mock('@/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: mockTasks,
    apiStatus: mockStatus,
    error: null,
    activeLabel: mockActiveLabel,
    fetchTasks: jest.fn(),
    selectLabel: mockSelectLabel,
    toggleTaskStatus: jest.fn(),
  }),
}));

beforeEach(() => {
  mockTasks = [];
  mockStatus = 'idle';
  mockActiveLabel = null;
  mockSelectLabel.mockClear();
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

  it('shows derived label counts in the sidebar and forwards clicks to selectLabel', () => {
    mockTasks = [
      { ...MOCK_TASK, labels: ['frontend'] },
      { ...MOCK_TASK_2, labels: ['frontend'] },
    ];
    const { container } = render(<AppLayout />);

    const sidebarLabel = within(container.querySelector('aside')!).getByText('frontend');
    expect(sidebarLabel.closest('button')).toHaveTextContent('2');

    fireEvent.click(sidebarLabel);
    expect(mockSelectLabel).toHaveBeenCalledWith('frontend');
  });

  it('renders only the active label section when a label is selected', () => {
    mockTasks = [
      { ...MOCK_TASK, labels: ['frontend'] },
      { ...MOCK_TASK_2, labels: ['backend'] },
    ];
    mockActiveLabel = 'frontend';
    render(<AppLayout />);

    expect(screen.getByText('Review pull request #482')).toBeInTheDocument();
    expect(screen.queryByText('Fix flaky test')).not.toBeInTheDocument();
  });
});
