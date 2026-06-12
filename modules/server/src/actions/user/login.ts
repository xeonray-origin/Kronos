import { AuthUser } from '@/entities';
import { ValidationError } from '@/errors';
import { IAction, IJwtToken, ISessionDAO, IUserDAO, IValidator } from '@/interfaces';

type Payload = Pick<AuthUser, 'email' | 'password'>;
type LoginResult = { success: boolean; token: string };

class LoginUser implements IAction<Payload, LoginResult> {
  constructor(
    protected validator: IValidator<AuthUser>,
    protected userDAO: IUserDAO,
    protected sessionDAO: ISessionDAO,
    protected verifyPassword: (
      password: string,
      salt: string,
      storedHash: string,
    ) => Promise<boolean>,
    protected jwtToken: IJwtToken,
  ) {}

  async call(payload: Payload): Promise<LoginResult> {
    const { isValid, errors = [] } = this.validator.validate(payload);
    if (!isValid) {
      const errorMessages = Array.isArray(errors)
        ? errors
        : errors.issues.map((issue) => issue.message);
      throw new ValidationError(`Validation failed: ${errorMessages.join(', ')}`);
    }

    const user = await this.userDAO.findAuthByEmail(payload.email!);
    if (!user) {
      throw new ValidationError('Invalid email or password');
    }

    const isPasswordValid = await this.verifyPassword(payload.password, user.salt, user.password);
    if (!isPasswordValid) {
      throw new ValidationError('Invalid email or password');
    }

    const accessToken = await this.jwtToken.generateToken({
      exp: Math.floor(Date.now() / 1000) + 3600,
      userId: user._id?.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = await this.jwtToken.generateRefreshToken({
      exp: Math.floor(Date.now() / 1000) + 3600,
      userId: user._id?.toString(),
      email: user.email,
      role: user.role,
    });

    await this.sessionDAO.storeRefreshToken(user, {
      refreshToken,
      isActive: true,
      lastActiveOn: 'Today 9th May, BLR 10:30pm IST',
    });

    return { success: true, token: accessToken };
  }
}

export default LoginUser;
