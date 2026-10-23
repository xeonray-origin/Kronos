import { initateLogin, initiateRegister, logout, refreshSession } from '@/api/auth.api';
import client from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

describe('auth api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts credentials to /auth/login', async () => {
    const payload = { email: 'test@example.com', password: 'secret' };
    (client.post as jest.Mock).mockResolvedValue({ data: { token: 'access.token' } });

    const result = await initateLogin(payload);

    expect(client.post).toHaveBeenCalledWith('/auth/login', payload);
    expect(result).toEqual({ token: 'access.token' });
  });

  it('calls GET /auth/refresh', async () => {
    (client.get as jest.Mock).mockResolvedValue({ data: { token: 'new.token' } });

    const result = await refreshSession();

    expect(client.get).toHaveBeenCalledWith('/auth/refresh');
    expect(result).toEqual({ token: 'new.token' });
  });

  it('posts the new user to /auth/register', async () => {
    const payload = {
      name: { firstName: 'Test', lastName: 'User' },
      email: 'test@example.com',
      password: 'secret',
      confirmPassword: 'secret',
      phoneNumber: '5551234567',
      role: 'user',
    };
    (client.post as jest.Mock).mockResolvedValue({ data: { email: payload.email } });

    const result = await initiateRegister(payload);

    expect(client.post).toHaveBeenCalledWith('/auth/register', payload);
    expect(result).toEqual({ email: payload.email });
  });

  describe('logout', () => {
    it('calls POST /auth/logout', async () => {
      (client.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      const result = await logout();

      expect(client.post).toHaveBeenCalledWith('/auth/logout');
      expect(client.get).not.toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('rejects when the request fails', async () => {
      (client.post as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(logout()).rejects.toThrow('Network error');
    });
  });
});
