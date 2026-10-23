import client from './client';
import type {
  IAuthPayload,
  ILogoutResponse,
  IRefreshResponse,
  IRegisterPayload,
  IRegisterResponse,
} from '@/types';

export const initateLogin = (payload: IAuthPayload) =>
  client.post('/auth/login', payload).then((response) => response.data);

export const refreshSession = (): Promise<IRefreshResponse> =>
  client.get('/auth/refresh').then((response) => response.data);

export const initiateRegister = (payload: IRegisterPayload): Promise<IRegisterResponse> =>
  client.post('/auth/register', payload).then((response) => response.data);

export const logout = (): Promise<ILogoutResponse> =>
  client.post('/auth/logout').then((response) => response.data);
