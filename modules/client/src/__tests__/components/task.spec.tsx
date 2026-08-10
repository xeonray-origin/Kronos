import { render, screen, fireEvent } from '@testing-library/react';
import { Task } from '@/components';
import { TaskStatus } from '@/types';

describe('Task', () => {
  it('renders title and an uncompleted circle when no optional props are provided', () => {
    render(<Task title="Write tests" status={TaskStatus.BACKLOG} userId="u1" />);

    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete task' }).className).toMatch(
      /border-muted-foreground/,
    );
  });

  it('renders dueDate and labels when provided', () => {
    render(
      <Task
        title="Ship feature"
        status={TaskStatus.BACKLOG}
        userId="u1"
        dueDate="2026-07-20"
        labels={['frontend', 'auth']}
      />,
    );

    expect(screen.getByText('Jul 20, 2026')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('auth')).toBeInTheDocument();
  });

  it('renders done state with strikethrough and checkmark', () => {
    render(<Task title="Done task" status={TaskStatus.DONE} userId="u1" />);

    expect(screen.getByText('Done task').className).toMatch(/line-through/);
    expect(screen.getByRole('button', { name: 'Complete task' }).className).toMatch(
      /bg-emerald-500/,
    );
  });

  it('calls onToggleStatus with the task id when the circle is clicked', () => {
    const onToggleStatus = jest.fn();
    render(
      <Task
        id="42"
        title="Toggle me"
        status={TaskStatus.BACKLOG}
        userId="u1"
        onToggleStatus={onToggleStatus}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Complete task' }));
    expect(onToggleStatus).toHaveBeenCalledWith('42');
  });

  it('does not call onToggleStatus when the task has no id', () => {
    const onToggleStatus = jest.fn();
    render(
      <Task
        title="No id"
        status={TaskStatus.BACKLOG}
        userId="u1"
        onToggleStatus={onToggleStatus}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Complete task' }));
    expect(onToggleStatus).not.toHaveBeenCalled();
  });

  it('calls handleTimer with task id when clock icon is clicked', () => {
    const handleTimer = jest.fn();
    render(
      <Task
        id="42"
        title="Timed task"
        status={TaskStatus.BACKLOG}
        userId="u1"
        handleTimer={handleTimer}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Toggle task timer card' }));
    expect(handleTimer).toHaveBeenCalledWith('42');
  });

  it('does not render timer button when id is missing', () => {
    render(<Task title="No id" status={TaskStatus.BACKLOG} userId="u1" handleTimer={jest.fn()} />);

    expect(
      screen.queryByRole('button', { name: 'Toggle task timer card' }),
    ).not.toBeInTheDocument();
  });
});
