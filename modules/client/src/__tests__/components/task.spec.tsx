import { render, screen } from '@testing-library/react';
import { Task } from '@/components';

describe('Task', () => {
  it('renders title and complete button when no optional props are provided', () => {
    render(<Task title="Write tests" />);

    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete task' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /yesterday|upskill/i })).not.toBeInTheDocument();
  });

  it('renders dueDate and project, omits label when only dueDate and project are provided', () => {
    render(<Task title="Ship feature" dueDate="Yesterday" project="Inbox" />);

    expect(screen.getByText('Yesterday')).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.queryByText('Upskill')).not.toBeInTheDocument();
  });

  it('renders label without dueDate when only label is provided', () => {
    render(<Task title="Ship feature" label="Upskill" />);

    expect(screen.getByText('Upskill')).toBeInTheDocument();
    expect(screen.queryByText('Yesterday')).not.toBeInTheDocument();
  });

  it('renders completed state with strikethrough and checkmark', () => {
    render(<Task title="Done task" completed />);

    const title = screen.getByText('Done task');
    expect(title.className).toMatch(/line-through/);
    expect(screen.getByRole('button', { name: 'Complete task' }).className).toMatch(
      /bg-emerald-500/,
    );
  });

  it('applies priority-based circle color', () => {
    render(<Task title="High priority" priority="high" />);

    expect(screen.getByRole('button', { name: 'Complete task' }).className).toMatch(
      /border-red-500/,
    );
  });

  it('renders multiple labels as badges', () => {
    render(<Task title="Labeled task" labels={['#code', '#ui']} />);

    expect(screen.getByText('#code')).toBeInTheDocument();
    expect(screen.getByText('#ui')).toBeInTheDocument();
  });

  it('renders progress dots', () => {
    const { container } = render(<Task title="Progress task" progress={{ filled: 2, total: 4 }} />);

    const dots = container.querySelectorAll('.size-2.rounded-full');
    expect(dots).toHaveLength(4);
    expect((dots[0] as Element).className).toMatch(/bg-red-500/);
    expect((dots[2] as Element).className).toMatch(/bg-muted/);
  });

  it('renders flag icon when flagColor is provided', () => {
    const { container } = render(<Task title="Flagged task" flagColor="orange" />);

    const flag = container.querySelector('svg');
    expect(flag).toBeInTheDocument();
  });

  it('renders timer icon when showTimer is true', () => {
    const { container } = render(<Task title="Timed task" showTimer />);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders dueDate in muted color when dueDateMuted is true', () => {
    render(<Task title="Muted date" dueDate="Tomorrow" dueDateMuted />);

    const dateSpan = screen.getByText('Tomorrow').closest('span');
    expect(dateSpan).not.toBeNull();
    expect(dateSpan!.className).toMatch(/text-muted-foreground/);
    expect(dateSpan!.className).not.toMatch(/text-destructive/);
  });
});
