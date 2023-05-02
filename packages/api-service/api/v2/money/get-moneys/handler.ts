import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { moneyMapper } from '../../../../modules/money/money.mapper';
import { moneyService } from '../../../../modules/money/money.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse> {
  const { projectId } = ctx;
  const moneys = await moneyService.getMoneys(ctx, projectId);

  return {
    body: {
      moneys: moneys.map(money => moneyMapper.toDTO(money)),
    },
  };
}
