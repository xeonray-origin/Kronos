import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '@/components';
import { authApi } from '@/api';

jest.mock('@/api', () => ({
  authApi: {
    initiateRegister: jest.fn(),
  },
}));

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

    it('renders the phone number input with label and placeholder', () => {
      render(<SignupForm />);
      expect(screen.getByText('Phone number')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('+1 555 123 4567')).toBeInTheDocument();
    });

    it('renders the sign up button', () => {
      render(<SignupForm />);
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });
  });

  describe('phone number input', () => {
    it('updates value on change', () => {
      render(<SignupForm />);
      const input = screen.getByPlaceholderText('+1 555 123 4567') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '5551234567' } });
      expect(input.value).toBe('5551234567');
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('calls initiateRegister with the split name and form values on submit', async () => {
      (authApi.initiateRegister as jest.Mock).mockResolvedValue({});
      render(<SignupForm />);

      fireEvent.change(screen.getByPlaceholderText('Alex Johnson'), {
        target: { value: 'Jane Doe' },
      });
      fireEvent.change(screen.getByPlaceholderText('alex@company.com'), {
        target: { value: 'jane@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('+1 555 123 4567'), {
        target: { value: '5551234567' },
      });
      const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('••••••••') as [
        HTMLInputElement,
        HTMLInputElement,
      ];
      fireEvent.change(passwordInput, { target: { value: 'secret123' } });
      fireEvent.change(confirmInput, { target: { value: 'secret123' } });

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(authApi.initiateRegister).toHaveBeenCalledWith({
          name: { firstName: 'Jane', lastName: 'Doe' },
          email: 'jane@example.com',
          phoneNumber: '5551234567',
          password: 'secret123',
          confirmPassword: 'secret123',
          role: 'user',
        });
      });
    });

    it('does not throw when initiateRegister rejects', async () => {
      (authApi.initiateRegister as jest.Mock).mockRejectedValue(new Error('failed'));
      render(<SignupForm />);

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(authApi.initiateRegister).toHaveBeenCalled();
      });
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
