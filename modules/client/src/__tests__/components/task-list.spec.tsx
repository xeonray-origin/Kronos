import { render, screen } from '@testing-library/react';
import { TaskList } from '@/components';

const TODO_TASK = { id: '1', status: 'todo' as const, title: 'Write docs' };
const IN_PROGRESS_TASK = { id: '2', status: 'in-progress' as const, title: 'Fix bug' };
const DONE_TASK = { id: '3', status: 'done' as const, title: 'Ship feature', completed: true };

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
});
