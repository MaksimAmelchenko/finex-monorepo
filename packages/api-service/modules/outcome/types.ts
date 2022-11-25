import { IRequestContext, TDate } from '../../types/app';

export interface GetAccountDailyBalancesParamsRepositoryResponse {
  startDate: TDate;
  endDate: TDate;
}

export interface OutcomeRepository {
  getAccountDailyBalancesParams(
    ctx: IRequestContext,
    projectId: string,
    userId: string
  ): Promise<GetAccountDailyBalancesParamsRepositoryResponse>;
}
