import type { CreateTaskInput } from '@/types';

export interface ValidationError {
  field: keyof CreateTaskInput;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

const MAX_TITLE_LENGTH = 255;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_LABELS_COUNT = 10;
const MAX_LABEL_LENGTH = 50;

export class CreateTaskValidator {
  /**
   * Validates a create task input object
   * @param input The task input to validate
   * @returns ValidationResult containing validity status and any errors
   */
  static validate(input: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return {
        isValid: false,
        errors: [{ field: 'title', message: 'Input must be a valid object' }],
      };
    }

    const task = input as Partial<CreateTaskInput>;

    // Validate title (required)
    const titleError = this.validateTitle(task.title);
    if (titleError) {
      errors.push(titleError);
    }

    // Validate description (optional)
    const descriptionError = this.validateDescription(task.description);
    if (descriptionError) {
      errors.push(descriptionError);
    }

    // Validate dueDate (optional)
    const dueDateError = this.validateDueDate(task.dueDate);
    if (dueDateError) {
      errors.push(dueDateError);
    }

    // Validate labels (optional)
    const labelsError = this.validateLabels(task.labels);
    if (labelsError) {
      errors.push(labelsError);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates the title field
   * @param title The title to validate
   * @returns ValidationError if invalid, undefined if valid
   */
  private static validateTitle(title: unknown): ValidationError | undefined {
    if (title === undefined) {
      return { field: 'title', message: 'Title is required and cannot be empty' };
    }

    if (typeof title !== 'string') {
      return { field: 'title', message: 'Title must be a string' };
    }

    if (!title.trim()) {
      return { field: 'title', message: 'Title is required and cannot be empty' };
    }

    if (title.length > MAX_TITLE_LENGTH) {
      return {
        field: 'title',
        message: `Title must not exceed ${MAX_TITLE_LENGTH} characters`,
      };
    }

    return undefined;
  }

  /**
   * Validates the description field
   * @param description The description to validate
   * @returns ValidationError if invalid, undefined if valid
   */
  private static validateDescription(description: unknown): ValidationError | undefined {
    if (description === undefined || description === null) {
      return undefined;
    }

    if (typeof description !== 'string') {
      return { field: 'description', message: 'Description must be a string' };
    }

    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      return {
        field: 'description',
        message: `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
      };
    }

    return undefined;
  }

  /**
   * Validates the dueDate field
   * @param dueDate The due date to validate
   * @returns ValidationError if invalid, undefined if valid
   */
  private static validateDueDate(dueDate: unknown): ValidationError | undefined {
    if (dueDate === undefined || dueDate === null) {
      return undefined;
    }

    if (typeof dueDate !== 'string') {
      return { field: 'dueDate', message: 'Due date must be a string' };
    }

    if (!dueDate.trim()) {
      return { field: 'dueDate', message: 'Due date cannot be empty' };
    }

    // Validate ISO 8601 date format (YYYY-MM-DD)
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(dueDate)) {
      return { field: 'dueDate', message: 'Due date must be in YYYY-MM-DD format' };
    }

    // Validate that it's a valid date
    const dateObj = new Date(dueDate);
    if (Number.isNaN(dateObj.getTime())) {
      return { field: 'dueDate', message: 'Due date is not a valid date' };
    }

    return undefined;
  }

  /**
   * Validates the labels field
   * @param labels The labels to validate
   * @returns ValidationError if invalid, undefined if valid
   */
  private static validateLabels(labels: unknown): ValidationError | undefined {
    if (labels === undefined || labels === null) {
      return undefined;
    }

    if (!Array.isArray(labels)) {
      return { field: 'labels', message: 'Labels must be an array' };
    }

    if (labels.length > MAX_LABELS_COUNT) {
      return {
        field: 'labels',
        message: `Maximum ${MAX_LABELS_COUNT} labels allowed`,
      };
    }

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];

      if (typeof label !== 'string') {
        return { field: 'labels', message: `Label at index ${i} must be a string` };
      }

      if (!label.trim()) {
        return { field: 'labels', message: `Label at index ${i} cannot be empty` };
      }

      if (label.length > MAX_LABEL_LENGTH) {
        return {
          field: 'labels',
          message: `Label at index ${i} must not exceed ${MAX_LABEL_LENGTH} characters`,
        };
      }
    }

    return undefined;
  }
}
