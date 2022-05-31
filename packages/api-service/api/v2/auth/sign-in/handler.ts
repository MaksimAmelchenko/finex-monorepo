import { IRequestContext } from '../../../../types/app';
import { Auth } from '../../../../services/auth';
import { ISessionResponse } from '../../../../types/auth';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext<{ username: string; password: string }, false>): Promise<IResponse> {
  const { username, password } = ctx.params;
  const { authorization, projectId, userId }: ISessionResponse = await Auth.signIn(ctx, username, password);

  return {
    body: {
      authorization,
      idUser: userId,
      idProject: projectId,
    },
  };
}
