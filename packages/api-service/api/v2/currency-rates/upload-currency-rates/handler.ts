import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { CurrencyRates } from '../../../../services/currency-rates';
import { format, startOfDay, subDays } from 'date-fns';

export async function handler(ctx: IRequestContext): Promise<IResponse<Record<string, never>>> {
  const {
    dateFrom = format(startOfDay(subDays(new Date(), 2)), 'yyyy-MM-dd'),
    dateTo = format(startOfDay(new Date()), 'yyyy-MM-dd'),
  } = ctx.params;

  await CurrencyRates.uploadCurrencyRates(ctx, { dateFrom, dateTo });
  return {
    body: {},
  };
}
