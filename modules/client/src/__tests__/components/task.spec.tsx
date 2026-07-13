import { render, screen } from '@testing-library/react';
import { Task } from '@/components';
import { TaskStatus } from '@/types';

describe('Task', () => {
  it('renders title and complete button when no optional props are provided', () => {
    render(<Task title="Write tests" status={TaskStatus.TODO} userId="u1" />);

    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete task' })).toBeInTheDocument();
  });

  it('renders dueDate and labels when provided', () => {
    render(
      <Task
        title="Ship feature"
        status={TaskStatus.TODO}
        userId="u1"
        dueDate="Yesterday"
        labels={['frontend', 'auth']}
      />,
    );

    expect(screen.getByText('Yesterday')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('auth')).toBeInTheDocument();
  });

  it('renders completed state with strikethrough and checkmark', () => {
    render(<Task title="Done task" status={TaskStatus.DONE} userId="u1" isCompleted />);

    const title = screen.getByText('Done task');
    expect(title.className).toMatch(/line-through/);
    expect(screen.getByRole('button', { name: 'Complete task' }).className).toMatch(
      /bg-emerald-500/,
    );
  });

  it('applies status-based circle color', () => {
    render(<Task title="In progress" status={TaskStatus.IN_PROGRESS} userId="u1" />);

    expect(screen.getByRole('button', { name: 'Complete task' }).className).toMatch(
      /text-blue-500/,
    );
  });

  it('renders timer icon when handleTimer is provided', () => {
    const { container } = render(
      <Task title="Timed task" status={TaskStatus.TODO} userId="u1" handleTimer={jest.fn()} />,
    );

    expect(container.querySelector('svg.lucide-clock')).toBeInTheDocument();
  });
});
