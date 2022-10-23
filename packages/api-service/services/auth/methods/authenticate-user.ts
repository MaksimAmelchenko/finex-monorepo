import * as bcrypt from 'bcryptjs';

import { IRequestContext } from '../../../types/app';
import { IUser } from '../../../modules/user/types';
import { UnauthorizedError } from '../../../libs/errors';
import { userMapper } from '../../../modules/user/user.mapper';
import { userRepository } from '../../../modules/user/user.repository';

export async function authenticateUser(ctx: IRequestContext, username: string, password: string): Promise<IUser> {
  const user = await userRepository.getUserByUsername(ctx, username);
  if (!user) {
    throw new UnauthorizedError('Invalid username or password');
  }

  const isValidPassword: boolean = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid username or password');
  }

  return userMapper.toDomain(user);
}
