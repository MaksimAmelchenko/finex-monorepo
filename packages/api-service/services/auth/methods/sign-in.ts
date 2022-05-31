import { IRequestContext } from '../../../types/app';
import { TSignInResponse } from '../../../types/auth';
import { Session } from '../../session';
import { authenticateUser } from './authenticate-user';
import { IUser } from '../../../types/user';
import { ISession } from '../../../types/session';
import { ProjectGateway } from '../../project/gateway';
import { IProject } from '../../../types/project';

export async function signIn(
  ctx: IRequestContext<any, false>,
  username: string,
  password: string
): Promise<TSignInResponse> {
  const { userAgent } = ctx.additionalParams;

  const user: IUser = await authenticateUser(ctx, username, password);
  const projects: IProject[] = await ProjectGateway.getAllByUserId(ctx, user.id);
  const projectIds: number[] = projects.map(project => project.id);

  let projectId: number | undefined = user.projectId;
  if (!projectId || !projectIds.includes(projectId)) {
    projectId = projectIds[0];
    ctx.log.warn({ userId: user.id, projectId }, 'The default project is not set');
  }

  const session: ISession = await Session.createSession(ctx, user.id, {
    projectId,
    timeout: user.timeout,
    userAgent,
  });

  const token = Session.getJwt(session.id);

  return {
    authorization: token,
    userId: user.id,
    projectId,
  };
}
