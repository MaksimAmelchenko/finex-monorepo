import { IRequestContext } from '../../../types/app';
import { Project } from '../../project/model/project';
import { ProjectGateway } from '../../project/gateway';
import { Session } from '../../session/model/session';
import { SessionService } from '../../session';
import { TSignInResponse } from '../../../types/auth';
import { authenticateUser } from './authenticate-user';

export async function signIn(ctx: IRequestContext, username: string, password: string): Promise<TSignInResponse> {
  const { userAgent, ip } = ctx.additionalParams;

  const user = await authenticateUser(ctx, username, password);
  const projects: Project[] = await ProjectGateway.getProjects(ctx, user.id);

  const projectIds: string[] = projects.map(project => String(project.idProject));

  let projectId: string;
  if (user.projectId && projectIds.includes(user.projectId)) {
    projectId = user.projectId;
  } else {
    projectId = projectIds[0];
    ctx.log.warn({ userId: user.id, projectId }, 'The default project is not set');
  }

  const session: Session = await SessionService.createSession(ctx, user.id, {
    projectId,
    timeout: user.timeout || 'PT20M',
    userAgent,
    ip,
  });

  const token = SessionService.getJwt(session.id);

  return {
    authorization: token,
    // for backward compatibility
    idUser: Number(user.id),
    idProject: Number(projectId),
  };
}
