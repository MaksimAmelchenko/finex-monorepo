import { FindCashFlowsAPIQuery, FindCashFlowsServiceQuery, ICashFlowDTO } from '../../../../modules/cash-flow/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { cashFlowMapper } from '../../../../modules/cash-flow/cash-flow.mapper';
import { cashFlowService } from '../../../../modules/cash-flow/cash-flow.service';

export async function handler(ctx: IRequestContext<FindCashFlowsAPIQuery, true>): Promise<
  IResponse<{
    cashFlows: ICashFlowDTO[];
    metadata: {
      offset: number;
      limit: number;
      total: number;
    };
  }>
> {
  const {
    projectId,
    userId,
    params: { offset = 0, limit = 50, searchText, startDate, endDate, accounts, contractors, tags },
  } = ctx;

  const params = {
    offset,
    limit,
    searchText,
    startDate,
    endDate,
    accounts: accounts ? accounts.split(',') : undefined,
    contractors: contractors ? contractors.split(',') : undefined,
    tags: tags ? tags.split(',') : undefined,
  };

  const { cashFlows, metadata } = await cashFlowService.findCashFlows(ctx, projectId, userId, params);

  return {
    body: {
      cashFlows: cashFlows.map(cashFlow => cashFlowMapper.toDTO(cashFlow)),
      metadata,
    },
  };
}
