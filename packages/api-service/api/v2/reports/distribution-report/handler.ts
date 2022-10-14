import dbRequest from '../../../../libs/db-request';
import { IRequestContext, TDate } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

interface GetDistributionReportAPIData {
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
}

export async function handler(ctx: IRequestContext<GetDistributionReportAPIData, true>): Promise<IResponse> {
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
  } = ctx.params;

  const response = await dbRequest(ctx, 'cf.report.distribution', {
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
  });

  return {
    body: response,
  };
}
