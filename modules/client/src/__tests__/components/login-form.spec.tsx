import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '@/components';

describe('LoginForm', () => {
  describe('rendering', () => {
    it('renders the Google SSO button', () => {
      render(<LoginForm />);
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });

    it('renders the email input with label and placeholder', () => {
      render(<LoginForm />);
      expect(screen.getByText('Email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('alex@company.com')).toBeInTheDocument();
    });

    it('renders the password input with label', () => {
      render(<LoginForm />);
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('renders the forgot password link', () => {
      render(<LoginForm />);
      expect(screen.getByRole('button', { name: /forgot password/i })).toBeInTheDocument();
    });

    it('renders the remember me checkbox and label', () => {
      render(<LoginForm />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Remember me for 30 days')).toBeInTheDocument();
    });

    it('renders the sign in button', () => {
      render(<LoginForm />);
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('email input', () => {
    it('updates value on change', () => {
      render(<LoginForm />);
      const input = screen.getByPlaceholderText('alex@company.com') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'user@example.com' } });
      expect(input.value).toBe('user@example.com');
    });
  });

  describe('password input', () => {
    it('starts as type password', () => {
      render(<LoginForm />);
      const input = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('updates value on change', () => {
      render(<LoginForm />);
      const input = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'secret123' } });
      expect(input.value).toBe('secret123');
    });

    it('toggles to text type when eye button is clicked', () => {
      render(<LoginForm />);
      const toggle = screen.getByLabelText('Toggle password visibility');
      const input = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

      fireEvent.click(toggle);
      expect(input.type).toBe('text');
    });

    it('toggles back to password type on second click', () => {
      render(<LoginForm />);
      const toggle = screen.getByLabelText('Toggle password visibility');
      const input = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

      fireEvent.click(toggle);
      fireEvent.click(toggle);
      expect(input.type).toBe('password');
    });
  });

  describe('remember me checkbox', () => {
    it('is unchecked initially', () => {
      render(<LoginForm />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
    });

    it('becomes checked after click', () => {
      render(<LoginForm />);
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('becomes unchecked after second click', () => {
      render(<LoginForm />);
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });
  });
});
