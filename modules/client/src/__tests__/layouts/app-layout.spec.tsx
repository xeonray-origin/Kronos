import { render, screen } from '@testing-library/react';
import AppLayout from '@/layouts/app';

const SAMPLE_TASK = {
  id: '1',
  status: 'todo' as const,
  title: 'Review pull request #482',
};

describe('AppLayout', () => {
  it('renders the sidebar', () => {
    render(<AppLayout tasks={[]} />);
    expect(screen.getByText('Xeonray')).toBeInTheDocument();
  });

  it('renders tasks passed as props in the task list', () => {
    render(<AppLayout tasks={[SAMPLE_TASK]} />);
    expect(screen.getByText('Review pull request #482')).toBeInTheDocument();
  });

  it('renders the timer', () => {
    render(<AppLayout tasks={[]} />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });
});
