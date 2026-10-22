import { NextFunction, Request, Response } from 'express';

const mockRouter = {
  use: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const mockController = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockSessionHandle = jest.fn();

jest.mock('express', () => ({
  __esModule: true,
  default: { Router: jest.fn(() => mockRouter) },
}));

jest.mock('@/dao', () => ({ LabelDAO: jest.fn() }));

jest.mock('@/actions', () => ({
  CreateLabel: jest.fn(),
  UpdateLabel: jest.fn(),
  DeleteLabel: jest.fn(),
}));

jest.mock('@/controllers', () => ({
  LabelController: jest.fn(() => mockController),
}));

jest.mock('@/middlewares/session.middleware', () => ({
  __esModule: true,
  default: jest.fn(() => ({ handle: mockSessionHandle })),
}));

jest.mock('@/utils', () => ({
  JWTToken: jest.fn(),
  labelUpdateValidator: {},
}));

import router from '@/routes/label.route';

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

const makeResponse = (userId?: string): Response =>
  ({ locals: { user: { userId } }, send: jest.fn() }) as unknown as Response;

describe('label route', () => {
  const useHandler = mockRouter.use.mock.calls[0][0] as Handler;
  const [postPath, postHandler] = mockRouter.post.mock.calls[0] as [string, Handler];
  const [putPath, putHandler] = mockRouter.put.mock.calls[0] as [string, Handler];
  const [deletePath, deleteHandler] = mockRouter.delete.mock.calls[0] as [string, Handler];

  const next = jest.fn() as jest.MockedFunction<NextFunction>;
  const error = new Error('boom');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exports the router with session middleware applied before the endpoints', () => {
    expect(router).toBe(mockRouter);
    expect(postPath).toBe('/create');
    expect(putPath).toBe('/update/:id');
    expect(deletePath).toBe('/delete/:id');

    const req = {} as Request;
    const res = makeResponse();
    useHandler(req, res, next);

    expect(mockSessionHandle).toHaveBeenCalledWith(req, res, next);
  });

  it('POST /create assigns the label to the authenticated user, ignoring a client userId', async () => {
    const created = { id: 'label-1' };
    mockController.create.mockResolvedValue(created);
    const res = makeResponse('user-123');

    await postHandler({ body: { labels: ['work'], userId: 'attacker' } } as Request, res, next);

    expect(mockController.create).toHaveBeenCalledWith({
      body: { labels: ['work'], userId: 'user-123' },
    });
    expect(res.send).toHaveBeenCalledWith(created);
  });

  it('POST /create forwards errors to next', async () => {
    mockController.create.mockRejectedValue(error);

    await postHandler({ body: {} } as Request, makeResponse('user-123'), next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('PUT /update/:id updates the label scoped to the authenticated user', async () => {
    const updated = { id: 'label-1' };
    mockController.update.mockResolvedValue(updated);
    const res = makeResponse('user-123');

    await putHandler(
      { body: { labels: ['home'] }, params: { id: 'label-1' } } as unknown as Request,
      res,
      next,
    );

    expect(mockController.update).toHaveBeenCalledWith({
      body: { labels: ['home'] },
      params: { id: 'label-1', userId: 'user-123' },
    });
    expect(res.send).toHaveBeenCalledWith(updated);
  });

  it('PUT /update/:id forwards errors to next', async () => {
    mockController.update.mockRejectedValue(error);

    await putHandler(
      { body: {}, params: { id: 'label-1' } } as unknown as Request,
      makeResponse('user-123'),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });

  it('DELETE /delete/:id deletes the label scoped to the authenticated user', async () => {
    mockController.delete.mockResolvedValue(true);
    const res = makeResponse('user-123');

    await deleteHandler({ params: { id: 'label-1' } } as unknown as Request, res, next);

    expect(mockController.delete).toHaveBeenCalledWith({
      params: { id: 'label-1', userId: 'user-123' },
    });
    expect(res.send).toHaveBeenCalledWith(true);
  });

  it('DELETE /delete/:id forwards errors to next', async () => {
    mockController.delete.mockRejectedValue(error);

    await deleteHandler(
      { params: { id: 'label-1' } } as unknown as Request,
      makeResponse('user-123'),
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
