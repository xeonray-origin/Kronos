import { render, screen, fireEvent } from '@testing-library/react';
import { SignupForm } from '@/components';

describe('SignupForm', () => {
  describe('rendering', () => {
    it('renders the Google SSO button', () => {
      render(<SignupForm />);
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });

    it('renders the full name input with label and placeholder', () => {
      render(<SignupForm />);
      expect(screen.getByText('Full name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Alex Johnson')).toBeInTheDocument();
    });

    it('renders the email input with label and placeholder', () => {
      render(<SignupForm />);
      expect(screen.getByText('Email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('alex@company.com')).toBeInTheDocument();
    });

    it('renders the password input with label', () => {
      render(<SignupForm />);
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    it('renders the confirm password input with label', () => {
      render(<SignupForm />);
      expect(screen.getByText('Confirm password')).toBeInTheDocument();
    });

    it('renders the sign up button', () => {
      render(<SignupForm />);
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });
  });

  describe('name input', () => {
    it('updates value on change', () => {
      render(<SignupForm />);
      const input = screen.getByPlaceholderText('Alex Johnson') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Jane Doe' } });
      expect(input.value).toBe('Jane Doe');
    });
  });

  describe('email input', () => {
    it('updates value on change', () => {
      render(<SignupForm />);
      const input = screen.getByPlaceholderText('alex@company.com') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'user@example.com' } });
      expect(input.value).toBe('user@example.com');
    });
  });

  describe('password input', () => {
    it('starts as type password', () => {
      render(<SignupForm />);
      const [passwordInput] = screen.getAllByPlaceholderText('••••••••') as [
        HTMLInputElement,
        HTMLInputElement,
      ];
      expect(passwordInput.type).toBe('password');
    });

    it('updates value on change', () => {
      render(<SignupForm />);
      const [passwordInput] = screen.getAllByPlaceholderText('••••••••') as [
        HTMLInputElement,
        HTMLInputElement,
      ];
      fireEvent.change(passwordInput, { target: { value: 'secret123' } });
      expect(passwordInput.value).toBe('secret123');
    });

    it('toggles to text type when eye button is clicked', () => {
      render(<SignupForm />);
      const toggle = screen.getByLabelText('Toggle password visibility');
      const [passwordInput] = screen.getAllByPlaceholderText('••••••••') as [
        HTMLInputElement,
        HTMLInputElement,
      ];
      fireEvent.click(toggle);
      expect(passwordInput.type).toBe('text');
    });

    it('toggles back to password type on second click', () => {
      render(<SignupForm />);
      const toggle = screen.getByLabelText('Toggle password visibility');
      const [passwordInput] = screen.getAllByPlaceholderText('••••••••') as [
        HTMLInputElement,
        HTMLInputElement,
      ];
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('confirm password input', () => {
    it('starts as type password', () => {
      render(<SignupForm />);
      const [, confirmInput] = screen.getAllByPlaceholderText('••••••••') as [
        HTMLInputElement,
        HTMLInputElement,
      ];
      expect(confirmInput.type).toBe('password');
    });

    it('updates value on change', () => {
      render(<SignupForm />);
      const [, confirmInput] = screen.getAllByPlaceholderText('••••••••') as [
        HTMLInputElement,
        HTMLInputElement,
      ];
      fireEvent.change(confirmInput, { target: { value: 'secret123' } });
      expect(confirmInput.value).toBe('secret123');
    });

    it('toggles to text type when eye button is clicked', () => {
      render(<SignupForm />);
      const toggle = screen.getByLabelText('Toggle confirm password visibility');
      const [, confirmInput] = screen.getAllByPlaceholderText('••••••••') as [
        HTMLInputElement,
        HTMLInputElement,
      ];
      fireEvent.click(toggle);
      expect(confirmInput.type).toBe('text');
    });

    it('toggles back to password type on second click', () => {
      render(<SignupForm />);
      const toggle = screen.getByLabelText('Toggle confirm password visibility');
      const [, confirmInput] = screen.getAllByPlaceholderText('••••••••') as [
        HTMLInputElement,
        HTMLInputElement,
      ];
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      expect(confirmInput.type).toBe('password');
    });
  });
});
