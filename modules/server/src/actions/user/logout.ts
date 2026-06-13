import { SessionPayload } from '@/entities';
import { ValidationError } from '@/errors';
import { IAction, IJwtToken, ISessionDAO } from '@/interfaces';
import { Types } from 'mongoose';

class LogoutUser implements IAction<SessionPayload, { success: boolean }> {
  constructor(
    protected sessionDAO: ISessionDAO,
    protected jwtToken: IJwtToken,
  ) {}

  async call(payload: SessionPayload): Promise<{ success: boolean }> {
    const decoded = await this.jwtToken.verifyRefreshToken(payload.refreshToken);
    if (!decoded) {
      throw new ValidationError('Unauthorized!', undefined, 401);
    }
    await this.sessionDAO.invalidatePreviousToken({
      _id: new Types.ObjectId(decoded.userId as string),
    });
    return { success: true };
  }
}

export default LogoutUser;
