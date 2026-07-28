import client from '@/api/client';
import { store, authActions } from '@/store';

jest.mock('@/store', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
  authActions: {
    setToken: jest.fn(),
    clearToken: jest.fn(),
  },
}));

const mockStore = store as unknown as { getState: jest.Mock; dispatch: jest.Mock };
const mockSetToken = authActions.setToken as unknown as jest.Mock;
const mockClearToken = authActions.clearToken as unknown as jest.Mock;

describe('client', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('has the correct baseURL', () => {
    expect(client.defaults.baseURL).toBe('http://localhost:8080/api');
  });

  it('sends credentials with every request', () => {
    expect(client.defaults.withCredentials).toBe(true);
  });

  describe('request interceptor', () => {
    const getInterceptor = () => (client.interceptors.request as any).handlers.find(Boolean);

    it('adds a Bearer Authorization header when token exists in store', () => {
      mockStore.getState.mockReturnValue({ auth: { token: 'test-token' } });
      const config = { headers: {} as Record<string, string> };
      const result = getInterceptor().fulfilled(config);
      expect(result.headers.Authorization).toBe('Bearer test-token');
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

    it('refreshes token on 401 and retries the original request once', async () => {
      const newToken = 'refreshed-token';
      const action = { type: 'auth/setToken', payload: newToken };
      mockSetToken.mockReturnValue(action);
      const retried = { data: { ok: true } };
      const getSpy = jest.spyOn(client, 'get').mockResolvedValue({ data: { token: newToken } });
      const requestSpy = jest.spyOn(client, 'request').mockResolvedValue(retried as any);

      const error = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };

      const result = await getInterceptor().rejected(error);

      expect(getSpy).toHaveBeenCalledWith('/auth/refresh');
      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
      expect(error.config.headers.Authorization).toBe('Bearer refreshed-token');
      expect(requestSpy).toHaveBeenCalledWith(error.config);
      expect(result).toBe(retried);
    });

    it('clears the token and throws when refresh fails on 401', async () => {
      const refreshError = new Error('Refresh failed');
      jest.spyOn(client, 'get').mockRejectedValue(refreshError);

      const error = { response: { status: 401 }, config: { headers: {} } };

      await expect(getInterceptor().rejected(error)).rejects.toBe(refreshError);
      expect(mockClearToken).toHaveBeenCalled();
    });

    it('does not refresh again for an already retried request', async () => {
      const getSpy = jest.spyOn(client, 'get');
      const error = { response: { status: 401 }, config: { headers: {}, _retry: true } };

      await expect(getInterceptor().rejected(error)).rejects.toBe(error);
      expect(getSpy).not.toHaveBeenCalled();
    });

    it('does not refresh when the failing request is the refresh call itself', async () => {
      const getSpy = jest.spyOn(client, 'get');
      const error = { response: { status: 401 }, config: { headers: {}, url: '/auth/refresh' } };

      await expect(getInterceptor().rejected(error)).rejects.toBe(error);
      expect(getSpy).not.toHaveBeenCalled();
    });

    it('throws immediately when there is no request config', async () => {
      const getSpy = jest.spyOn(client, 'get');
      const error = { response: { status: 401 } };

      await expect(getInterceptor().rejected(error)).rejects.toBe(error);
      expect(getSpy).not.toHaveBeenCalled();
    });

    it('throws immediately for non-401 errors', async () => {
      const getSpy = jest.spyOn(client, 'get');
      const error = { response: { status: 500 }, config: { headers: {} } };

      await expect(getInterceptor().rejected(error)).rejects.toBe(error);
      expect(getSpy).not.toHaveBeenCalled();
    });
  });
});
