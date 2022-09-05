import { IRequestContext } from '../../types/app';
import { UserGateway } from '../../services/user/gateway';

export async function deleteUser(ctx: IRequestContext<never, false>, username: string): Promise<void> {
  const user = await UserGateway.getUserByUsername(ctx, username);

  if (user) {
    await UserGateway.deleteUser(ctx, String(user.idUser));
  }
}
