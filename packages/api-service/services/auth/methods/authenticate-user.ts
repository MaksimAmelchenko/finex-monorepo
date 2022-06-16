import * as bcrypt from 'bcryptjs';
import { IRequestContext } from '../../../types/app';
import { UnauthorizedError } from '../../../libs/errors';
import { User } from '../../user/model/user';
import { UserGateway } from '../../user/gateway';

export async function authenticateUser(
  ctx: IRequestContext<any, false>,
  username: string,
  password: string
): Promise<User> {
  const user: User | undefined = await UserGateway.getUserByUsername(ctx, username);
  if (!user) {
    throw new UnauthorizedError('Invalid username or password');
  }

  const isValidPassword: boolean = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid username or password');
  }

  return user;
}
