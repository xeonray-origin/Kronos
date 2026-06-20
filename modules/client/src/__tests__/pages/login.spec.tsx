import { render, screen } from '@testing-library/react';
import LoginPage from '@/pages/login';

describe('LoginPage', () => {
  it('renders the welcome heading', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('renders the account subtitle', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign in to your Kronos account')).toBeInTheDocument();
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('alex@company.com')).toBeInTheDocument();
  });

  it('renders the sign up prompt and link', () => {
    render(<LoginPage />);
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up free/i })).toBeInTheDocument();
  });
});
