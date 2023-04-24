import { CurrencyDAO } from './models/currency-dao';
import { ICurrencyDAO, CurrencyRepository } from './types';
import { IRequestContext } from '../../types/app';

class CurrencyRepositoryImpl implements CurrencyRepository {
  async getCurrencies(ctx: IRequestContext): Promise<ICurrencyDAO[]> {
    ctx.log.trace('try to get currencies');

    return CurrencyDAO.query(ctx.trx);
  }
}

export const currencyRepository = new CurrencyRepositoryImpl();
