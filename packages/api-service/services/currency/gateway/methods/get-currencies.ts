import { IRequestContext } from '../../../../types/app';
import { Currency } from '../../model/currency';

export async function getCurrencies(ctx: IRequestContext): Promise<Currency[]> {
  ctx.log.trace('try to get currencies');
  return Currency.query(ctx.trx).orderBy('name');
}
