import { NextFunction, Request, Response } from 'express';

const mockRouter = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const mockController = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getByUser: jest.fn(),
  logTime: jest.fn(),
};

const mockSessionHandle = jest.fn();

jest.mock('express', () => ({
  __esModule: true,
  default: { Router: jest.fn(() => mockRouter) },
}));

jest.mock('@/dao', () => ({ TaskDAO: jest.fn() }));

jest.mock('@/actions', () => ({
  CreateTask: jest.fn(),
  UpdateTask: jest.fn(),
  DeleteTask: jest.fn(),
  GetUserTasks: jest.fn(),
  LogTaskTime: jest.fn(),
}));

jest.mock('@/controllers', () => ({
  TaskController: jest.fn(() => mockController),
}));

jest.mock('@/middlewares/session.middleware', () => ({
  __esModule: true,
  default: jest.fn(() => ({ handle: mockSessionHandle })),
}));

jest.mock('@/utils', () => ({
  JWTToken: jest.fn(),
  taskValidator: {},
  taskUpdateValidator: {},
  taskTimeValidator: {},
}));

import router from '@/routes/task.route';

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

const makeResponse = (userId?: string): Response =>
  ({ locals: { user: { userId } }, send: jest.fn() }) as unknown as Response;

describe('task route', () => {
  const useHandler = mockRouter.use.mock.calls[0][0] as Handler;
  const [getPath, getHandler] = mockRouter.get.mock.calls[0] as [string, Handler];
  const [postPath, postHandler] = mockRouter.post.mock.calls[0] as [string, Handler];
  const [logTimePath, logTimeHandler] = mockRouter.post.mock.calls[1] as [string, Handler];
  const [putPath, putHandler] = mockRouter.put.mock.calls[0] as [string, Handler];
  const [deletePath, deleteHandler] = mockRouter.delete.mock.calls[0] as [string, Handler];

  const next = jest.fn() as jest.MockedFunction<NextFunction>;
  const error = new Error('boom');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exports the router with session middleware applied before the endpoints', () => {
    expect(router).toBe(mockRouter);
    expect(getPath).toBe('/');
    expect(postPath).toBe('/create');
    expect(putPath).toBe('/update/:id');
    expect(deletePath).toBe('/delete/:id');
    expect(logTimePath).toBe('/log-time/:id');

    const req = {} as Request;
    const res = makeResponse();
    useHandler(req, res, next);

    expect(mockSessionHandle).toHaveBeenCalledWith(req, res, next);
  });

  it('GET / returns tasks for the authenticated user', async () => {
    const tasks = [{ id: 'task-1' }];
    mockController.getByUser.mockResolvedValue(tasks);
    const res = makeResponse('user-123');

    await getHandler({} as Request, res, next);

    expect(mockController.getByUser).toHaveBeenCalledWith({ params: { userId: 'user-123' } });
    expect(res.send).toHaveBeenCalledWith(tasks);
  });

  it('GET / forwards errors to next', async () => {
    mockController.getByUser.mockRejectedValue(error);

    await getHandler({} as Request, makeResponse('user-123'), next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('POST /create creates a task for the authenticated user', async () => {
    const created = { id: 'task-1' };
    mockController.create.mockResolvedValue(created);
    const res = makeResponse('user-123');

    await postHandler({ body: { title: 'New task' } } as Request, res, next);

    expect(mockController.create).toHaveBeenCalledWith({
      body: { title: 'New task', userId: 'user-123' },
    });
    expect(res.send).toHaveBeenCalledWith(created);
  });

  it('POST /create forwards errors to next', async () => {
    mockController.create.mockRejectedValue(error);

    await postHandler({ body: {} } as Request, makeResponse('user-123'), next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('PUT /update/:id updates the task scoped to the authenticated user', async () => {
    const updated = { id: 'task-1' };
    mockController.update.mockResolvedValue(updated);
    const res = makeResponse('user-123');

    await putHandler(
      { body: { title: 'Updated' }, params: { id: 'task-1' } } as unknown as Request,
      res,
      next,
    );

    expect(mockController.update).toHaveBeenCalledWith({
      body: { title: 'Updated' },
      params: { id: 'task-1', userId: 'user-123' },
    });
    expect(res.send).toHaveBeenCalledWith(updated);
  });

  it('PUT /update/:id forwards errors to next', async () => {
    mockController.update.mockRejectedValue(error);

    await putHandler(
      { body: {}, params: { id: 'task-1' } } as unknown as Request,
      makeResponse('user-123'),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });

  it('DELETE /delete/:id deletes the task scoped to the authenticated user', async () => {
    mockController.delete.mockResolvedValue(true);
    const res = makeResponse('user-123');

    await deleteHandler({ params: { id: 'task-1' } } as unknown as Request, res, next);

    expect(mockController.delete).toHaveBeenCalledWith({
      params: { id: 'task-1', userId: 'user-123' },
    });
    expect(res.send).toHaveBeenCalledWith(true);
  });

  it('DELETE /delete/:id forwards errors to next', async () => {
    mockController.delete.mockRejectedValue(error);

    await deleteHandler(
      { params: { id: 'task-1' } } as unknown as Request,
      makeResponse('user-123'),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });

  it('POST /log-time/:id logs time scoped to the authenticated user', async () => {
    const updated = { id: 'task-1', timeSpentSeconds: 390 };
    mockController.logTime.mockResolvedValue(updated);
    const res = makeResponse('user-123');

    await logTimeHandler(
      { body: { durationSeconds: 390 }, params: { id: 'task-1' } } as unknown as Request,
      res,
      next,
    );

    expect(mockController.logTime).toHaveBeenCalledWith({
      body: { durationSeconds: 390 },
      params: { id: 'task-1', userId: 'user-123' },
    });
    expect(res.send).toHaveBeenCalledWith(updated);
  });

  it('POST /log-time/:id forwards errors to next', async () => {
    mockController.logTime.mockRejectedValue(error);

    await logTimeHandler(
      { body: {}, params: { id: 'task-1' } } as unknown as Request,
      makeResponse('user-123'),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
