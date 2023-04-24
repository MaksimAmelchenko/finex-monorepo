import { ICurrencyDTO } from '../../../../modules/currency/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { currencyMapper } from '../../../../modules/currency/currency.mapper';
import { currencyService } from '../../../../modules/currency/currency.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse<{ currencies: ICurrencyDTO[] }>> {
  const { locale } = ctx.params;
  const currencies = await currencyService.getCurrencies(ctx);

  return {
    body: {
      currencies: currencies.map(currency => currencyMapper.toDTO(currency, locale)),
    },
  };
}
