import { AuthUser, SessionPayload } from '@/entities';
import { ValidationError } from '@/errors';
import { IAction, IJwtToken, ISessionDAO, IUserDAO, IValidator } from '@/interfaces';
import { Types } from 'mongoose';

type LoginResult = {
  _id: Types.ObjectId;
  success: boolean;
  token: string;
  refreshToken: string;
  maxCookieAge: number;
};

class RefreshToken implements IAction<SessionPayload, LoginResult> {
  constructor(
    protected sessionDAO: ISessionDAO,
    protected userDAO: IUserDAO,
    protected jwtToken: IJwtToken,
  ) {}

  async call(payload: SessionPayload): Promise<LoginResult> {
    const { refreshToken } = payload;
    const refreshTokenResult = await this.jwtToken.verifyRefreshToken(refreshToken);
    if (!refreshTokenResult) {
      throw new ValidationError('Unauthorized!');
    }
    const user = await this.userDAO.findAuthByEmail(refreshTokenResult.email as string);
    if (!user) {
      throw new ValidationError('Unauthorized!');
    }
    const accessToken = await this.jwtToken.generateToken({
      //access token valid for 1hr
      exp: Math.floor(Date.now() / 1000) + 3600,
      userId: user._id?.toString(),
      email: user.email,
      role: user.role,
    });
    const generatedRefreshToken = await this.jwtToken.generateRefreshToken({
      // refresh token valid for a week
      exp: Math.floor(Date.now() / 1000) + 604800,
      userId: user._id?.toString(),
      email: user.email,
      role: user.role,
    });
    await this.sessionDAO.invalidatePreviousToken({ _id: user._id });
    await this.sessionDAO.storeRefreshToken(user, {
      refreshToken: generatedRefreshToken,
    });

    return {
      _id: user._id,
      success: true,
      token: accessToken,
      refreshToken: generatedRefreshToken,
      maxCookieAge: Math.floor(Date.now() / 1000) + 604800,
    };
  }
}

export default RefreshToken;
