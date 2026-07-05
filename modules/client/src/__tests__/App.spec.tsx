import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '@/App';
import { store } from '@/store';

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
  Topbar: ({ onToggleTheme, isDark }: { onToggleTheme: (v: boolean) => void; isDark: boolean }) => (
    <button data-testid="topbar-toggle" onClick={() => onToggleTheme(!isDark)}>
      toggle
    </button>
  ),
  LoginForm: () => <div data-testid="login-form" />,
  SignupForm: () => <div data-testid="signup-form" />,
  CreateTaskModal: () => null,
}));

function renderApp() {
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

describe('App', () => {
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
});
