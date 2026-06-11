import { AuthUser, User } from '@/entities';
import { ValidationError } from '@/errors';
import { IAction, IUserDAO, IValidator } from '@/interfaces';
import _ from 'lodash';

type Payload = Pick<
  AuthUser,
  'email' | 'name' | 'password' | 'role' | 'salt' | 'confirmPassword' | 'phoneNumber'
>;
class RegisterUser implements IAction<User> {
  constructor(
    protected validator: IValidator<AuthUser>,
    protected userDAO: IUserDAO,
    protected encryptPassword: (password: string) => Promise<{ password: string; salt: string }>,
  ) {}
  async call(payload: Payload): Promise<User> {
    const { isValid, errors = [], value } = this.validator.validate(payload);
    if (!isValid) {
      const errorMessages = Array.isArray(errors)
        ? errors
        : errors.issues.map((issue) => issue.message);
      throw new ValidationError(`Validation failed: ${errorMessages.join(', ')}`);
    }
    const existingUser = await this.userDAO.findByEmail(payload.email);
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }
    const { confirmPassword, ...finalPayload } = payload;
    const { password, salt } = await this.encryptPassword(finalPayload.password);
    _.assign(finalPayload, { password, salt });
    const createdUser = await this.userDAO.create(finalPayload as AuthUser);
    return createdUser;
  }
}

export default RegisterUser;
