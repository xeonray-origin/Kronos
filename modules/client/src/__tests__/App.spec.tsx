import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '@/App';
import { store } from '@/store';
import type { CreateTaskInput } from '@/types';

const mockCreateTask = jest.fn();

jest.mock('@/hooks/useTasks', () => ({
  useTasks: () => ({ createTask: mockCreateTask }),
}));

jest.mock('react-router', () => ({
  Routes: () => null,
  Route: () => null,
}));

jest.mock('@/layouts', () => ({
  SignupPage: () => <div data-testid="signup-page" />,
  LoginPage: () => <div data-testid="login-page" />,
  AppLayout: () => <div data-testid="app-layout" />,
  AuthLayout: () => <div data-testid="auth-layout" />,
}));

jest.mock('@/components', () => ({
  Topbar: ({
    onToggleTheme,
    isDark,
    onAddTask,
  }: {
    onToggleTheme: (v: boolean) => void;
    isDark: boolean;
    onAddTask: () => void;
  }) => (
    <>
      <button data-testid="topbar-toggle" onClick={() => onToggleTheme(!isDark)}>
        toggle
      </button>
      <button data-testid="topbar-add-task" onClick={onAddTask}>
        add
      </button>
    </>
  ),
  LoginForm: () => <div data-testid="login-form" />,
  SignupForm: () => <div data-testid="signup-form" />,
  CreateTaskModal: ({
    open,
    onClose,
    onSubmit,
  }: {
    open: boolean;
    onClose: () => void;
    onSubmit: (task: CreateTaskInput) => Promise<void>;
  }) => (
    <div data-testid="create-task-modal" data-open={open}>
      <button data-testid="modal-submit" onClick={() => onSubmit({ title: 'New task' })}>
        submit
      </button>
      <button data-testid="modal-close" onClick={onClose}>
        close
      </button>
    </div>
  ),
}));

function renderApp() {
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders in dark mode by default', () => {
    const { container } = renderApp();
    expect(container.firstChild).toHaveClass('dark');
  });

  it('renders the topbar', () => {
    renderApp();
    expect(screen.getByTestId('topbar-toggle')).toBeInTheDocument();
  });

  it('switches to light mode when onToggleTheme is called with false', () => {
    const { container } = renderApp();
    fireEvent.click(screen.getByTestId('topbar-toggle'));
    expect(container.firstChild).toHaveClass('light');
  });

  it('switches back to dark mode when onToggleTheme is called with true', () => {
    const { container } = renderApp();
    fireEvent.click(screen.getByTestId('topbar-toggle'));
    fireEvent.click(screen.getByTestId('topbar-toggle'));
    expect(container.firstChild).toHaveClass('dark');
  });

  it('opens the create task modal from the topbar', () => {
    renderApp();
    expect(screen.getByTestId('create-task-modal')).toHaveAttribute('data-open', 'false');

    fireEvent.click(screen.getByTestId('topbar-add-task'));

    expect(screen.getByTestId('create-task-modal')).toHaveAttribute('data-open', 'true');
  });

  it('closes the create task modal', () => {
    renderApp();
    fireEvent.click(screen.getByTestId('topbar-add-task'));

    fireEvent.click(screen.getByTestId('modal-close'));

    expect(screen.getByTestId('create-task-modal')).toHaveAttribute('data-open', 'false');
  });

  it('creates a task when the modal submits', async () => {
    mockCreateTask.mockResolvedValue({ id: '1', title: 'New task' });
    renderApp();

    await act(async () => {
      fireEvent.click(screen.getByTestId('modal-submit'));
    });

    expect(mockCreateTask).toHaveBeenCalledWith({ title: 'New task' });
  });
});
