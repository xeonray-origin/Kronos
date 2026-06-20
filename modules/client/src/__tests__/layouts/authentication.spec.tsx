import { render, screen, fireEvent } from '@testing-library/react';
import AuthenticationLayout from '@/layouts/authentication';
import { LoginForm } from '@/components';

jest.mock('react-router', () => ({
  useNavigate: () => jest.fn(),
  Outlet: () => {
    return <LoginForm />;
  },
}));

describe('Login route', () => {
  it('renders the welcome heading', () => {
    render(<AuthenticationLayout />);
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('renders the account subtitle', () => {
    render(<AuthenticationLayout />);
    expect(screen.getByText('Sign in to your Kronos account')).toBeInTheDocument();
  });

  it('renders the login form', () => {
    render(<AuthenticationLayout />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('alex@company.com')).toBeInTheDocument();
  });

  it('renders the sign up prompt and link', () => {
    render(<AuthenticationLayout />);
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up free/i })).toBeInTheDocument();
  });
});
