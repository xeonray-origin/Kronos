import { render, screen, fireEvent } from '@testing-library/react';
import AppLayout from '@/pages/app-layout';

describe('AppLayout', () => {
  it('renders the topbar', () => {
    render(<AppLayout />);
    expect(screen.getByPlaceholderText('Add a task...')).toBeInTheDocument();
  });

  it('renders the sidebar', () => {
    render(<AppLayout />);
    expect(screen.getByText('Xeonray')).toBeInTheDocument();
  });

  it('renders sample tasks in the task list', () => {
    render(<AppLayout />);
    expect(screen.getByText('Review pull request #482')).toBeInTheDocument();
  });

  it('renders the timer', () => {
    render(<AppLayout />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('defaults to board view', () => {
    render(<AppLayout />);
    expect(screen.getByLabelText('Board view')).toHaveClass('bg-accent');
    expect(screen.getByLabelText('List view')).not.toHaveClass('bg-accent');
  });

  it('switches to list view on list button click', () => {
    render(<AppLayout />);
    fireEvent.click(screen.getByLabelText('List view'));
    expect(screen.getByLabelText('List view')).toHaveClass('bg-accent');
    expect(screen.getByLabelText('Board view')).not.toHaveClass('bg-accent');
  });

  it('switches back to board view on board button click', () => {
    render(<AppLayout />);
    fireEvent.click(screen.getByLabelText('List view'));
    fireEvent.click(screen.getByLabelText('Board view'));
    expect(screen.getByLabelText('Board view')).toHaveClass('bg-accent');
    expect(screen.getByLabelText('List view')).not.toHaveClass('bg-accent');
  });
});
