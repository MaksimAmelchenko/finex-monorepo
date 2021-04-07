import * as jwt from 'jsonwebtoken';
import { IJwtPayload } from '../../../types/session';

import config from '../../../libs/config';

const { jwtSecret } = config.get('auth');

export function verifyJwt(token: string): IJwtPayload {
  return jwt.verify(token, jwtSecret);
}
