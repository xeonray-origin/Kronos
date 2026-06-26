import { render, screen } from '@testing-library/react';
import AppLayout from '@/layouts/app';

const MOCK_TASK = { _id: '1', title: 'Review pull request #482', userId: 'u1' };

let mockTasks: (typeof MOCK_TASK)[] = [];

jest.mock('@/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: mockTasks,
    isLoading: false,
    error: null,
    fetchTasks: jest.fn(),
  }),
}));

beforeEach(() => {
  mockTasks = [];
});

describe('AppLayout', () => {
  it('renders the sidebar hidden below md', () => {
    render(<AppLayout />);
    const sidebarWrapper = screen.getByText('Xeonray').closest('.hidden');
    expect(sidebarWrapper).toHaveClass('hidden', 'md:block');
  });

  it('renders tasks from the store in the task list', () => {
    mockTasks = [MOCK_TASK];
    render(<AppLayout />);
    expect(screen.getByText('Review pull request #482')).toBeInTheDocument();
  });

  it('renders the timer hidden below lg', () => {
    render(<AppLayout />);
    const timerWrapper = screen.getByText('25:00').closest('.hidden');
    expect(timerWrapper).toHaveClass('hidden', 'lg:block');
  });
});
