import { http, HttpResponse } from 'msw';
import type {
  CreateTaskInput,
  ILoginResponse,
  IRefreshResponse,
  IRegisterPayload,
  IRegisterResponse,
  ITaskResponse,
} from '@/types';
import { TaskStatus } from '@/types';
import tasks from './data/tasks.json';

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:8000';

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

  http.get(`${BASE_URL}/task`, () => HttpResponse.json<ITaskResponse[]>(tasks as ITaskResponse[])),

  http.post(`${BASE_URL}/task/create`, async ({ request }) => {
    const input = (await request.json()) as CreateTaskInput;
    return HttpResponse.json<ITaskResponse>({
      _id: `mock-task-${Date.now()}`,
      userId: 'mock-user-id',
      status: TaskStatus.BACKLOG,
      isCompleted: false,
      ...input,
    });
  }),
];
