import { IConnectionDTO } from '../../../../modules/connection/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { connectionMapper } from '../../../../modules/connection/connection.mapper';
import { connectionService } from '../../../../modules/connection/connection.service';

export async function handler(
  ctx: IRequestContext<unknown, true>
): Promise<IResponse<{ connections: IConnectionDTO[] }>> {
  const { projectId, userId } = ctx;
  const connections = await connectionService.getConnections(ctx, projectId, userId);

  return {
    body: {
      connections: connections.map(connection => connectionMapper.toConnectionDTO(connection)),
    },
  };
}
