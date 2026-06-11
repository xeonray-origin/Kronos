import dotenv from 'dotenv';
import path from 'path';

export default {
  env: process.env.NODE_ENV || 'development',
  dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kronos',
};
