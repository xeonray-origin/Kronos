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
});
