import client from './client';
import type { IAuthPayload, IRefreshResponse, IRegisterPayload, IRegisterResponse } from '@/types';

export const initateLogin = (payload: IAuthPayload) =>
  client.post('/auth/login', payload).then((response) => response.data);

export const refreshSession = (): Promise<IRefreshResponse> =>
  client.get('/auth/refresh').then((response) => response.data);

export const initiateRegister = (payload: IRegisterPayload): Promise<IRegisterResponse> =>
  client.post('/auth/register', payload).then((response) => response.data);
