import { render, screen } from '@testing-library/react';
import SignupPage from '@/pages/signup';

describe('SignupPage', () => {
  it('renders the create account heading', () => {
    render(<SignupPage />);
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<SignupPage />);
    expect(screen.getByText('Sign up for Kronos for free')).toBeInTheDocument();
  });

  it('renders the signup form', () => {
    render(<SignupPage />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Alex Johnson')).toBeInTheDocument();
  });

  it('renders the sign in prompt and link', () => {
    render(<SignupPage />);
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
