import { render, screen } from '@testing-library/react';
import AppLayout from '@/layouts/app';

const SAMPLE_TASK = {
  id: '1',
  status: 'todo' as const,
  title: 'Review pull request #482',
};

describe('AppLayout', () => {
  it('renders the sidebar hidden below md', () => {
    render(<AppLayout tasks={[]} />);
    const sidebarWrapper = screen.getByText('Xeonray').closest('.hidden');
    expect(sidebarWrapper).toHaveClass('hidden', 'md:block');
  });

  it('renders tasks passed as props in the task list', () => {
    render(<AppLayout tasks={[SAMPLE_TASK]} />);
    expect(screen.getByText('Review pull request #482')).toBeInTheDocument();
  });

  it('renders the timer hidden below lg', () => {
    render(<AppLayout tasks={[]} />);
    const timerWrapper = screen.getByText('25:00').closest('.hidden');
    expect(timerWrapper).toHaveClass('hidden', 'lg:block');
  });
});
