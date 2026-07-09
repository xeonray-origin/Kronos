import { http, HttpResponse } from 'msw';
import type {
  ILoginResponse,
  IRefreshResponse,
  IRegisterPayload,
  IRegisterResponse,
} from '@/types';

const BASE_URL = 'http://localhost:8080';

export const handlers = [
  http.post(`${BASE_URL}/auth/login`, () =>
    HttpResponse.json<ILoginResponse>({
      success: true,
      token: 'mock-access-token',
      maxCookieAge: 60 * 60 * 24 * 30,
    }),
  ),

  http.get(`${BASE_URL}/auth/refresh`, () =>
    HttpResponse.json<IRefreshResponse>({ token: 'mock-access-token' }),
  ),

  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    const { name, email, phoneNumber, role } = (await request.json()) as IRegisterPayload;
    return HttpResponse.json<IRegisterResponse>({
      _id: 'mock-user-id',
      name,
      email,
      phoneNumber,
      role,
    });
  }),
];
