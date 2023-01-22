import { UnauthorizedError } from '../errors';

export function resolveAuthorizationHeader(authorization: string): string {
  const parts = authorization.split(' ');
  if (parts.length === 2) {
    const [scheme, token] = parts;

    if (scheme === 'Bearer') {
      return token;
    }
  }

  throw new UnauthorizedError('Bad Authorization header format. Format is "Authorization: Bearer <token>"');
}
