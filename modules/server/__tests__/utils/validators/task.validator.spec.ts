import { ZodError } from 'zod';
import taskValidator, { taskUpdateValidator } from '@/utils/validators/task.validator';

const validInput = {
  title: 'Draft Q3 roadmap',
  description: 'Outline the key initiatives.',
  dueDate: '2026-07-20',
  labels: ['planning', 'roadmap'],
  userId: 'user-123',
};

const firstMessage = (errors: unknown) => (errors as ZodError<unknown>).issues[0]?.message;

describe('taskValidator', () => {
  it('accepts a fully valid payload', () => {
    const result = taskValidator.validate(validInput);
    expect(result.isValid).toBe(true);
  });

  it('accepts a payload with only the required fields', () => {
    const result = taskValidator.validate({ title: 'Fix bug', userId: 'user-123' });
    expect(result.isValid).toBe(true);
  });

  it('trims the title and labels on the parsed value', () => {
    const result = taskValidator.validate({
      ...validInput,
      title: '  Fix bug  ',
      labels: ['  planning  '],
    });
    expect(result.value.title).toBe('Fix bug');
    expect(result.value.labels).toEqual(['planning']);
  });

  it('rejects a missing title', () => {
    const result = taskValidator.validate({ userId: 'user-123' });
    expect(result.isValid).toBe(false);
  });

  it('rejects a whitespace-only title', () => {
    const result = taskValidator.validate({ ...validInput, title: '   ' });
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('Title is required and cannot be empty');
  });

  it('rejects a title longer than 255 characters', () => {
    const result = taskValidator.validate({ ...validInput, title: 'a'.repeat(256) });
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('Title must not exceed 255 characters');
  });

  it('rejects a description longer than 2000 characters', () => {
    const result = taskValidator.validate({ ...validInput, description: 'a'.repeat(2001) });
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('Description must not exceed 2000 characters');
  });

  it('rejects a dueDate that is not in YYYY-MM-DD format', () => {
    const result = taskValidator.validate({ ...validInput, dueDate: 'Jul 20, 2026' });
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('Due date must be in YYYY-MM-DD format');
  });

  it('rejects a well-formed but non-existent dueDate', () => {
    const result = taskValidator.validate({ ...validInput, dueDate: '2026-13-45' });
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('Due date is not a valid date');
  });

  it('rejects more than 10 labels', () => {
    const result = taskValidator.validate({
      ...validInput,
      labels: Array.from({ length: 11 }, (_, i) => `label-${i}`),
    });
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('Maximum 10 labels allowed');
  });

  it('rejects an empty label', () => {
    const result = taskValidator.validate({ ...validInput, labels: ['   '] });
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('Label cannot be empty');
  });

  it('rejects a label longer than 50 characters', () => {
    const result = taskValidator.validate({ ...validInput, labels: ['a'.repeat(51)] });
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('Label must not exceed 50 characters');
  });

  it('rejects a missing userId', () => {
    const result = taskValidator.validate({ title: 'Fix bug' });
    expect(result.isValid).toBe(false);
  });

  it('rejects an empty userId', () => {
    const result = taskValidator.validate({ ...validInput, userId: '' });
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('userId is required');
  });

  it('accepts a DONE status', () => {
    const result = taskValidator.validate({ ...validInput, status: 'DONE' });
    expect(result.isValid).toBe(true);
  });

  it('rejects a status outside BACKLOG and DONE', () => {
    const result = taskValidator.validate({ ...validInput, status: 'TODO' } as never);
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('Status must be BACKLOG or DONE');
  });
});

describe('taskUpdateValidator', () => {
  it('accepts a partial payload containing only a status', () => {
    const result = taskUpdateValidator.validate({ status: 'DONE' });
    expect(result.isValid).toBe(true);
  });

  it('accepts a partial payload containing only a title', () => {
    const result = taskUpdateValidator.validate({ title: 'Updated title' });
    expect(result.isValid).toBe(true);
  });

  it('strips userId so ownership cannot be reassigned', () => {
    const result = taskUpdateValidator.validate({ title: 'Updated', userId: 'attacker' } as never);
    expect(result.isValid).toBe(true);
    expect(result.value).toEqual({ title: 'Updated' });
  });

  it('rejects an empty payload', () => {
    const result = taskUpdateValidator.validate({});
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('At least one field must be provided');
  });

  it('rejects a status outside BACKLOG and DONE', () => {
    const result = taskUpdateValidator.validate({ status: 'TODO' } as never);
    expect(result.isValid).toBe(false);
    expect(firstMessage(result.errors)).toBe('Status must be BACKLOG or DONE');
  });
});
