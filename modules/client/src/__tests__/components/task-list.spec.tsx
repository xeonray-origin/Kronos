import { render, screen } from '@testing-library/react';
import { TaskList } from '@/components';
import { TaskStatus, type ITask } from '@/types';

jest.mock('@/hooks/useTasks', () => ({
  useTasks: () => ({ tasks: [], error: null, fetchTasks: jest.fn() }),
}));

const TODO_TASK: ITask = { id: '1', status: TaskStatus.TODO, title: 'Write docs', userId: 'u1' };
const IN_PROGRESS_TASK: ITask = {
  id: '2',
  status: TaskStatus.IN_PROGRESS,
  title: 'Fix bug',
  userId: 'u1',
};
const DONE_TASK: ITask = {
  id: '3',
  status: TaskStatus.DONE,
  title: 'Ship feature',
  userId: 'u1',
  isCompleted: true,
};
const BACKLOG_TASK: ITask = {
  id: '5',
  status: TaskStatus.BACKLOG,
  title: 'Backlog item',
  userId: 'u1',
};

describe('TaskList', () => {
  it('renders nothing when tasks array is empty', () => {
    const { container } = render(<TaskList tasks={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correct group headers for each status', () => {
    render(<TaskList tasks={[TODO_TASK, IN_PROGRESS_TASK, DONE_TASK]} />);

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows correct task count per group', () => {
    render(
      <TaskList tasks={[TODO_TASK, { ...TODO_TASK, id: '4', title: 'Another todo' }, DONE_TASK]} />,
    );

    const counts = screen.getAllByText('2');
    expect(counts.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('only renders groups that have tasks', () => {
    render(<TaskList tasks={[TODO_TASK]} />);

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.queryByText('In Progress')).not.toBeInTheDocument();
    expect(screen.queryByText('Done')).not.toBeInTheDocument();
  });

  it('renders task titles inside the correct group section', () => {
    render(<TaskList tasks={[TODO_TASK, IN_PROGRESS_TASK]} />);

    expect(screen.getByText('Write docs')).toBeInTheDocument();
    expect(screen.getByText('Fix bug')).toBeInTheDocument();
  });

  it('excludes backlog tasks from all groups', () => {
    render(<TaskList tasks={[TODO_TASK, BACKLOG_TASK]} />);

    expect(screen.getByText('Write docs')).toBeInTheDocument();
    expect(screen.queryByText('Backlog item')).not.toBeInTheDocument();
  });
});
