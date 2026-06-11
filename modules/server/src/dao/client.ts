import mongoose from 'mongoose';
import { appConfig } from '@/config';

const dbUri = 'mongodb://admin:secret@localhost:27017/kronos?authSource=admin';
const client = mongoose.createConnection(dbUri, {});

client.on('connected', () => {
  console.log('MongoDB connected successfully');
});

client.on('error', (err: any) => {
  console.error('MongoDB connection error:', err);
});

export { client };
