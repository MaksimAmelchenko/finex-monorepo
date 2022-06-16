import { IRequestContext } from '../../../../types/app';
import { Auth } from '../../../../services/auth';
import { ISessionResponse } from '../../../../types/auth';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<{ username: string; password: string }, false>
): Promise<IResponse<ISessionResponse>> {
  const { username, password } = ctx.params;
  const { authorization, idProject, idUser }: ISessionResponse = await Auth.signIn(ctx, username, password);

  return {
    body: {
      authorization,
      // for backward compatibility
      idProject,
      idUser,
    },
  };
}
