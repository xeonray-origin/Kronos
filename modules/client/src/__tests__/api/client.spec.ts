import client from '@/api/client';

describe('client', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('has the correct baseURL', () => {
    expect(client.defaults.baseURL).toBe('http://localhost:8080');
  });

  it('sends credentials with every request', () => {
    expect(client.defaults.withCredentials).toBe(true);
  });

  it('adds Authorization header when token exists in localStorage', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('test-token');
    const interceptor = (client.interceptors.request as any).handlers.find(Boolean);
    const config = { headers: {} as Record<string, string> };
    const result = interceptor.fulfilled(config);
    expect(result.headers['Authorization']).toBe('test-token');
  });

  it('does not add Authorization header when no token in localStorage', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    const interceptor = (client.interceptors.request as any).handlers.find(Boolean);
    const config = { headers: {} as Record<string, string> };
    const result = interceptor.fulfilled(config);
    expect(result.headers['Authorization']).toBeUndefined();
  });
});
