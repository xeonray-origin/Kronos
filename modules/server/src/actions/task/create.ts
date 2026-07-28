import { Task } from '@/entities';
import { ValidationError } from '@/errors';
import { IAction, ITaskDAO, IValidator } from '@/interfaces';

class CreateTask implements IAction<Task> {
  constructor(
    protected validator: IValidator<Task>,
    protected taskDAO: ITaskDAO,
  ) {}

  async call(payload: Partial<Task>): Promise<Task> {
    const { isValid, errors = [], value } = this.validator.validate(payload);
    if (!isValid) {
      const errorMessages = Array.isArray(errors)
        ? errors
        : errors.issues.map((issue) => issue.message);
      throw new ValidationError(`Validation failed: ${errorMessages.join(', ')}`);
    }
    return await this.taskDAO.create(value);
  }
}

export default CreateTask;
