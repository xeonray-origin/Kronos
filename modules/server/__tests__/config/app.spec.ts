describe('appConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('falls back to development defaults when nothing is set', async () => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.MONGODB_URI;
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;

    const { default: config } = await import('@/config/app');

    expect(config.env).toBe('development');
    expect(config.port).toBe(8080);
    expect(config.dbUri).toBe('mongodb://localhost:27017/kronos');
    expect(config.jwtSecret).toBe('your_super_secret_key');
    expect(config.jwtRefreshSecret).toBe('your_super_refresh_secret_key');
  });

  it('reads provided values', async () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = '9000';
    process.env.MONGODB_URI = 'mongodb://db/app';
    process.env.JWT_SECRET = 's1';
    process.env.JWT_REFRESH_SECRET = 's2';

    const { default: config } = await import('@/config/app');

    expect(config.port).toBe(9000);
    expect(config.dbUri).toBe('mongodb://db/app');
    expect(config.jwtSecret).toBe('s1');
    expect(config.jwtRefreshSecret).toBe('s2');
  });

  it('throws in production when a required var is missing', async () => {
    process.env.NODE_ENV = 'production';
    process.env.MONGODB_URI = 'mongodb://db/app';
    process.env.JWT_SECRET = 's1';
    delete process.env.JWT_REFRESH_SECRET;

    await expect(import('@/config/app')).rejects.toThrow('JWT_REFRESH_SECRET');
  });
});
