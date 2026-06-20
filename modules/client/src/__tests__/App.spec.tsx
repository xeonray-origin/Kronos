import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';

jest.mock('@/pages', () => ({
  SignupPage: () => <div data-testid="signup-page" />,
  LoginPage: () => <div data-testid="login-page" />,
  AppLayout: () => <div data-testid="app-layout" />,
}));

jest.mock('@/components', () => ({
  Topbar: ({ onToggleTheme, isDark }: { onToggleTheme: (v: boolean) => void; isDark: boolean }) => (
    <button data-testid="topbar-toggle" onClick={() => onToggleTheme(!isDark)}>
      toggle
    </button>
  ),
}));

describe('App', () => {
  it('renders in dark mode by default', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toHaveClass('dark');
  });

  it('renders the signup page', () => {
    render(<App />);
    expect(screen.getByTestId('signup-page')).toBeInTheDocument();
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
