import client from './client';

export interface IAuthPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  token: string;
  maxCookieAge: number;
}

export const initateLogin = (payload: IAuthPayload) =>
  client.post('/auth/login', payload).then((response) => response.data);

export interface IRefreshResponse {
  token: string;
}

export const refreshSession = (): Promise<IRefreshResponse> =>
  client.get('/auth/refresh').then((response) => response.data);
