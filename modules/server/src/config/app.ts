const env = process.env.NODE_ENV || 'development';

const requireInProduction = (value: string | undefined, name: string, fallback: string): string => {
  if (env === 'production' && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || fallback;
};

export default {
  env,
  port: Number(process.env.PORT) || 8080,
  dbUri: requireInProduction(
    process.env.MONGODB_URI,
    'MONGODB_URI',
    'mongodb://localhost:27017/kronos',
  ),
  jwtSecret: requireInProduction(process.env.JWT_SECRET, 'JWT_SECRET', 'your_super_secret_key'),
  jwtRefreshSecret: requireInProduction(
    process.env.JWT_REFRESH_SECRET,
    'JWT_REFRESH_SECRET',
    'your_super_refresh_secret_key',
  ),
};
