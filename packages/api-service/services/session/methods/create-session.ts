import { CreateSessionGatewayData } from '../types';
import { IRequestContext } from '../../../types/app';
import { Session } from '../model/session';
import { SessionGateway } from '../gateway';

export async function createSession(
  ctx: IRequestContext<any, false>,
  userId: string,
  data: CreateSessionGatewayData
): Promise<Session> {
  return SessionGateway.createSession(ctx, userId, data);
}
