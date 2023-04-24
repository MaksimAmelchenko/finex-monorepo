import { StatusCodes } from 'http-status-codes';

import config from '../../../../libs/config';
import { CurrencyRates } from '../../../../services/currency-rates';
import { INoContent, IResponse } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';
import { UnauthorizedError } from '../../../../libs/errors';
import { format, startOfDay, subDays } from 'date-fns';

const secret = config.get('currencyRate:secret');

export async function handler(ctx: IRequestContext<any>): Promise<IResponse<INoContent>> {
  if (ctx.params.secret !== secret) {
    throw new UnauthorizedError('Invalid secret');
  }

  const {
    dateFrom = format(startOfDay(subDays(new Date(), 2)), 'yyyy-MM-dd'),
    dateTo = format(startOfDay(new Date()), 'yyyy-MM-dd'),
  } = ctx.params;

  await CurrencyRates.uploadCurrencyRates(ctx, { dateFrom, dateTo });

  return {
    status: StatusCodes.NO_CONTENT,
  };
}
