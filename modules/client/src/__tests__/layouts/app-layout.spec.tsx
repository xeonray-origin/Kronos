import { render, screen } from '@testing-library/react';
import AppLayout from '@/layouts/app';

describe('AppLayout', () => {
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
});
