import axios from 'axios';
import client from '@/api/client';
import { store, authActions } from '@/store';

jest.mock('@/store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
  authActions: {
    setToken: jest.fn(),
  },
}));

const mockStore = store as unknown as { getState: jest.Mock; dispatch: jest.Mock };
const mockSetToken = authActions.setToken as unknown as jest.Mock;

describe('client', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('has the correct baseURL', () => {
    expect(client.defaults.baseURL).toBe('http://localhost:8080');
  });

  it('sends credentials with every request', () => {
    expect(client.defaults.withCredentials).toBe(true);
  });

  describe('request interceptor', () => {
    const getInterceptor = () => (client.interceptors.request as any).handlers.find(Boolean);

    it('adds Authorization header when token exists in store', () => {
      mockStore.getState.mockReturnValue({ auth: { token: 'test-token' } });
      const config = { headers: {} as Record<string, string> };
      const result = getInterceptor().fulfilled(config);
      expect(result.headers.Authorization).toBe('test-token');
    });

    it('does not add Authorization header when no token in store', () => {
      mockStore.getState.mockReturnValue({ auth: { token: null } });
      const config = { headers: {} as Record<string, string> };
      const result = getInterceptor().fulfilled(config);
      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    const getInterceptor = () => (client.interceptors.response as any).handlers.find(Boolean);

    it('passes through successful responses', () => {
      const response = { data: { ok: true } };
      expect(getInterceptor().fulfilled(response)).toBe(response);
    });

    it('refreshes token on 401 and retries the request', async () => {
      const newToken = 'refreshed-token';
      const mockAction = { type: 'auth/setToken', payload: newToken };
      mockSetToken.mockReturnValue(mockAction);
      jest.spyOn(axios, 'get').mockResolvedValue({ data: { token: newToken } });

      const error = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };

      try {
        await getInterceptor().rejected(error);
      } catch (_) {}

      expect(axios.get).toHaveBeenCalledWith('/auth/refresh');
      expect(mockSetToken).toHaveBeenCalledWith(newToken);
      expect(mockStore.dispatch).toHaveBeenCalledWith(mockAction);
      expect(error.config.headers.Authorization).toBe(newToken);
    });

    it('throws when token refresh fails on 401', async () => {
      const refreshError = new Error('Refresh failed');
      jest.spyOn(axios, 'get').mockRejectedValue(refreshError);

      const error = {
        response: { status: 401 },
        config: { headers: {} },
      };

      await expect(getInterceptor().rejected(error)).rejects.toBe(refreshError);
    });

    it('throws immediately for non-401 errors', async () => {
      const axiosGetSpy = jest.spyOn(axios, 'get');
      const error = { response: { status: 500 } };

      await expect(getInterceptor().rejected(error)).rejects.toBe(error);
      expect(axiosGetSpy).not.toHaveBeenCalled();
    });
  });
});
