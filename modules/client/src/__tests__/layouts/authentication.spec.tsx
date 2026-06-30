import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import AuthenticationLayout from '@/layouts/authentication';
import { store } from '@/store';

const renderAuth = () =>
  render(
    <Provider store={store}>
      <AuthenticationLayout />
    </Provider>,
  );

describe('Login route', () => {
  it('renders the welcome heading', () => {
    renderAuth();
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('renders the account subtitle', () => {
    renderAuth();
    expect(screen.getByText('Sign in to your Kronos account')).toBeInTheDocument();
  });

  it('renders the login form', () => {
    renderAuth();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('alex@company.com')).toBeInTheDocument();
  });

  it('renders the sign up prompt and link', () => {
    renderAuth();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up free/i })).toBeInTheDocument();
  });
});
