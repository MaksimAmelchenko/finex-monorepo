import { CurrencyService, ICurrency } from './types';
import { IRequestContext } from '../../types/app';
import { currencyMapper } from './currency.mapper';
import { currencyRepository } from './currency.repository';

class CurrencyServiceImpl implements CurrencyService {
  async getCurrencies(ctx: IRequestContext<unknown, true>): Promise<ICurrency[]> {
    const currencyDAOs = await currencyRepository.getCurrencies(ctx);

    return currencyDAOs.map(currencyMapper.toDomain);
  }
}

export const currencyService = new CurrencyServiceImpl();
