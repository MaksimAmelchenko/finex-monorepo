import * as jwt from 'jsonwebtoken';
import config from '../../../libs/config';

const { jwtSecret } = config.get('auth');

export function getJwt(sessionId: string): string {
  return jwt.sign({ sessionId }, jwtSecret);
}
