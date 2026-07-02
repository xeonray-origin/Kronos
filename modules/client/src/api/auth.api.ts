import client from './client';
import type { IAuthPayload, IRefreshResponse } from '@/types';

export const initateLogin = (payload: IAuthPayload) =>
  client.post('/auth/login', payload).then((response) => response.data);

export const refreshSession = (): Promise<IRefreshResponse> =>
  client.get('/auth/refresh').then((response) => response.data);
