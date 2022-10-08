import dbRequest from '../../../../libs/db-request';
import { IRequestContext, TDate } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

interface CreateTransactionAPIData {
  startDate: TDate;
  endDate: TDate;
  isUseReportPeriod?: boolean;
  moneyId?: string;
  contractorsUsingType?: number;
  contractors?: string;
  accountsUsingType?: number;
  accounts?: string;
  categoriesUsingType?: number;
  categories?: string;
  tagsUsingType?: number;
  tags?: string;
  isUsePlan?: boolean;
}
export async function handler(ctx: IRequestContext<CreateTransactionAPIData, true>): Promise<IResponse> {
  const {
    startDate,
    endDate,
    isUseReportPeriod,
    moneyId,
    contractorsUsingType,
    contractors,
    accountsUsingType,
    accounts,
    categoriesUsingType,
    categories,
    tagsUsingType,
    tags,
    isUsePlan,
  } = ctx.params;

  const response = await dbRequest(ctx, 'cf.report.dynamics', {
    dBegin: startDate,
    dEnd: endDate,
    isUseReportPeriod,
    idMoney: Number(moneyId),
    contractorsUsingType,
    contractors,
    accountsUsingType,
    accounts,
    categoriesUsingType,
    categories,
    tagsUsingType,
    tags,
    isUsePlan,
  });

  return {
    body: response,
  };
}
