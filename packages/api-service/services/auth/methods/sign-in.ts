import { IRequestContext } from '../../../types/app';
import { TSignInResponse } from '../../../types/auth';
import { SessionService } from '../../session';
import { authenticateUser } from './authenticate-user';
import { ProjectGateway } from '../../project/gateway';
import { Project } from '../../project/model/project';
import { User } from '../../user/model/user';
import { Session } from '../../session/model/session';

export async function signIn(
  ctx: IRequestContext<any, false>,
  username: string,
  password: string
): Promise<TSignInResponse> {
  const { userAgent } = ctx.additionalParams;

  const user: User = await authenticateUser(ctx, username, password);
  const userId: string = String(user.idUser);
  const projects: Project[] = await ProjectGateway.getProjects(ctx, userId);

  const idsProject: number[] = projects.map(project => project.idProject);

  let projectId: string;
  if (user.idProject && idsProject.includes(user.idProject)) {
    projectId = String(user.idProject);
  } else {
    projectId = String(idsProject[0]);
    ctx.log.warn({ userId, projectId }, 'The default project is not set');
  }

  const session: Session = await SessionService.createSession(ctx, userId, {
    projectId,
    timeout: user.timeout || 'PT20M',
    userAgent,
  });

  const token = SessionService.getJwt(session.id);

  return {
    authorization: token,
    userId,
    projectId,
  };
}
