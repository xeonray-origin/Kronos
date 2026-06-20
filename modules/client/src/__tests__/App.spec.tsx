import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';

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
}));

describe('App', () => {
  it('renders in dark mode by default', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toHaveClass('dark');
  });

  it('renders the topbar', () => {
    render(<App />);
    expect(screen.getByTestId('topbar-toggle')).toBeInTheDocument();
  });

  it('switches to light mode when onToggleTheme is called with false', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByTestId('topbar-toggle'));
    expect(container.firstChild).toHaveClass('light');
  });

  it('switches back to dark mode when onToggleTheme is called with true', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByTestId('topbar-toggle'));
    fireEvent.click(screen.getByTestId('topbar-toggle'));
    expect(container.firstChild).toHaveClass('dark');
  });
});
