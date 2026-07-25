import {
  CreateTaskValidator,
  type ValidationError,
  type ValidationResult,
} from '@/utils/validators/create-task.validator';

describe('CreateTaskValidator', () => {
  describe('validate - valid inputs', () => {
    it('accepts a valid task with all fields', () => {
      const input = {
        title: 'Complete project',
        description: 'Finish the implementation',
        dueDate: '2026-12-31',
        labels: ['work', 'urgent'],
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts a valid task with only title', () => {
      const input = { title: 'Quick task' };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts a valid task with title and description', () => {
      const input = {
        title: 'Task title',
        description: 'Task description',
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts a valid task with title and dueDate', () => {
      const input = {
        title: 'Task with deadline',
        dueDate: '2026-08-15',
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts a valid task with title and labels', () => {
      const input = {
        title: 'Labeled task',
        labels: ['bug', 'critical'],
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts title with exactly 255 characters', () => {
      const input = {
        title: 'a'.repeat(255),
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts description with exactly 2000 characters', () => {
      const input = {
        title: 'Task',
        description: 'a'.repeat(2000),
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts exactly 10 labels', () => {
      const input = {
        title: 'Task',
        labels: Array.from({ length: 10 }, (_, i) => `label-${i}`),
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts label with exactly 50 characters', () => {
      const input = {
        title: 'Task',
        labels: ['a'.repeat(50)],
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts empty arrays for labels', () => {
      const input = {
        title: 'Task',
        labels: [],
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts empty string for description', () => {
      const input = {
        title: 'Task',
        description: '',
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('accepts null and undefined optional fields', () => {
      const input = {
        title: 'Task',
        description: undefined,
        dueDate: null,
        labels: undefined,
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validate - title field errors', () => {
    it('rejects when title is missing', () => {
      const input = { description: 'desc' };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('required'),
        }),
      );
    });

    it('rejects when title is empty string', () => {
      const input = { title: '' };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('required'),
        }),
      );
    });

    it('rejects when title is only whitespace', () => {
      const input = { title: '   ' };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('required'),
        }),
      );
    });

    it('rejects when title exceeds 255 characters', () => {
      const input = { title: 'a'.repeat(256) };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('255'),
        }),
      );
    });

    it('rejects when title is not a string', () => {
      const input = { title: 123 };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('string'),
        }),
      );
    });

    it('rejects when title is an object', () => {
      const input = { title: { text: 'task' } };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('string'),
        }),
      );
    });

    it('rejects when title is an array', () => {
      const input = { title: ['task'] };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('string'),
        }),
      );
    });

    it('rejects when title is null', () => {
      const input = { title: null };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('string'),
        }),
      );
    });
  });

  describe('validate - description field errors', () => {
    it('rejects when description exceeds 2000 characters', () => {
      const input = {
        title: 'Task',
        description: 'a'.repeat(2001),
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'description',
          message: expect.stringContaining('2000'),
        }),
      );
    });

    it('rejects when description is not a string', () => {
      const input = {
        title: 'Task',
        description: 123,
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'description',
          message: expect.stringContaining('string'),
        }),
      );
    });

    it('rejects when description is an object', () => {
      const input = {
        title: 'Task',
        description: { text: 'desc' },
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'description',
          message: expect.stringContaining('string'),
        }),
      );
    });

    it('rejects when description is an array', () => {
      const input = {
        title: 'Task',
        description: ['description'],
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'description',
          message: expect.stringContaining('string'),
        }),
      );
    });
  });

  describe('validate - dueDate field errors', () => {
    it('rejects when dueDate is not in YYYY-MM-DD format', () => {
      const input = {
        title: 'Task',
        dueDate: '31/12/2026',
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'dueDate',
          message: expect.stringContaining('YYYY-MM-DD'),
        }),
      );
    });

    it('rejects when dueDate is an invalid date', () => {
      const input = {
        title: 'Task',
        dueDate: '2026-13-45',
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'dueDate',
          message: expect.stringContaining('valid date'),
        }),
      );
    });

    it('rejects when dueDate is empty string', () => {
      const input = {
        title: 'Task',
        dueDate: '',
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'dueDate',
          message: expect.stringContaining('cannot be empty'),
        }),
      );
    });

    it('rejects when dueDate is only whitespace', () => {
      const input = {
        title: 'Task',
        dueDate: '   ',
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'dueDate',
          message: expect.stringContaining('cannot be empty'),
        }),
      );
    });

    it('rejects when dueDate is not a string', () => {
      const input = {
        title: 'Task',
        dueDate: 123,
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'dueDate',
          message: expect.stringContaining('string'),
        }),
      );
    });

    it('rejects when dueDate is an object', () => {
      const input = {
        title: 'Task',
        dueDate: new Date(),
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'dueDate',
          message: expect.stringContaining('string'),
        }),
      );
    });
  });

  describe('validate - labels field errors', () => {
    it('rejects when labels exceeds 10 items', () => {
      const input = {
        title: 'Task',
        labels: Array.from({ length: 11 }, (_, i) => `label-${i}`),
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'labels',
          message: expect.stringContaining('10'),
        }),
      );
    });

    it('rejects when label exceeds 50 characters', () => {
      const input = {
        title: 'Task',
        labels: ['a'.repeat(51)],
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'labels',
          message: expect.stringContaining('50'),
        }),
      );
    });

    it('rejects when label is empty string', () => {
      const input = {
        title: 'Task',
        labels: ['work', '', 'urgent'],
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'labels',
          message: expect.stringContaining('cannot be empty'),
        }),
      );
    });

    it('rejects when label is only whitespace', () => {
      const input = {
        title: 'Task',
        labels: ['work', '   ', 'urgent'],
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'labels',
          message: expect.stringContaining('cannot be empty'),
        }),
      );
    });

    it('rejects when label is not a string', () => {
      const input = {
        title: 'Task',
        labels: ['work', 123],
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'labels',
          message: expect.stringContaining('string'),
        }),
      );
    });

    it('rejects when label is an object', () => {
      const input = {
        title: 'Task',
        labels: [{ name: 'work' }],
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'labels',
          message: expect.stringContaining('string'),
        }),
      );
    });

    it('rejects when labels is not an array', () => {
      const input = {
        title: 'Task',
        labels: 'work',
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'labels',
          message: expect.stringContaining('array'),
        }),
      );
    });

    it('rejects when labels is an object', () => {
      const input = {
        title: 'Task',
        labels: { tag: 'work' },
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'labels',
          message: expect.stringContaining('array'),
        }),
      );
    });
  });

  describe('validate - input type errors', () => {
    it('rejects when input is null', () => {
      const result = CreateTaskValidator.validate(null);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('object'),
        }),
      );
    });

    it('rejects when input is undefined', () => {
      const result = CreateTaskValidator.validate(undefined);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('object'),
        }),
      );
    });

    it('rejects when input is a string', () => {
      const result = CreateTaskValidator.validate('task title');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('object'),
        }),
      );
    });

    it('rejects when input is a number', () => {
      const result = CreateTaskValidator.validate(123);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('object'),
        }),
      );
    });

    it('rejects when input is an array', () => {
      const result = CreateTaskValidator.validate(['task']);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: expect.stringContaining('object'),
        }),
      );
    });
  });

  describe('validate - multiple field errors', () => {
    it('returns all errors for multiple invalid fields', () => {
      const input = {
        title: '',
        description: 'a'.repeat(2001),
        dueDate: 'invalid-date',
        labels: 'not-array',
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.errors.map((e) => e.field)).toEqual(
        expect.arrayContaining(['title', 'description', 'dueDate', 'labels']),
      );
    });

    it('validates all fields even if some are invalid', () => {
      const input = {
        title: 'a'.repeat(256),
        description: 123,
        dueDate: '2026-14-50',
      };

      const result = CreateTaskValidator.validate(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('ValidationResult type', () => {
    it('returns ValidationResult with correct structure', () => {
      const result = CreateTaskValidator.validate({ title: 'Task' });

      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe('ValidationError type', () => {
    it('returns ValidationError with correct structure', () => {
      const result = CreateTaskValidator.validate({ title: '' });

      expect(result.errors[0]).toHaveProperty('field');
      expect(result.errors[0]).toHaveProperty('message');
    });
  });
});
