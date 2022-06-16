import * as jwt from 'jsonwebtoken';

import config from '../../../libs/config';
import { IJwtPayload } from '../types';

const { jwtSecret } = config.get('auth');

export function verifyJwt(token: string): IJwtPayload {
  return jwt.verify(token, jwtSecret);
}
