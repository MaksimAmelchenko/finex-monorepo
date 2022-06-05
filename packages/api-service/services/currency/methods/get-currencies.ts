import { Currency } from '../model/currency';
import { CurrencyGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function getCurrencies(ctx: IRequestContext): Promise<Currency[]> {
  return CurrencyGateway.getCurrencies(ctx);
}
