import * as bcrypt from 'bcryptjs';
import { IRequestContext } from '../../../types/app';
import { IUser } from '../../../types/user';
import { UnauthorizedError } from '../../../libs/errors';
import { UserGateway } from '../../user/gateway';

export async function authenticateUser(ctx: IRequestContext, username: string, password: string): Promise<IUser> {
  const user: IUser | undefined = await UserGateway.getByUsername(ctx, username);
  if (!user) {
    throw new UnauthorizedError('Invalid username or password');
  }

  const isValidPassword: boolean = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid username or password');
  }

  return user;
}
