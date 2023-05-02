import { IRequestContext, Locale, TI18nField } from '../../types/app';

export interface ICurrencyDAO {
  code: string;
  name: TI18nField<string>;
  precision: number;
  symbol: string;
}

export interface ICurrencyEntity extends ICurrencyDAO {}

export interface ICurrency extends ICurrencyEntity {}

export interface ICurrencyDTO extends Omit<ICurrencyEntity, 'name'> {
  name: string;
}

export interface CurrencyRepository {
  getCurrencies(ctx: IRequestContext): Promise<ICurrencyDAO[]>;
}

export interface CurrencyService {
  getCurrencies(ctx: IRequestContext): Promise<ICurrency[]>;
}

export interface CurrencyMapper {
  toDomain(currencyDAO: ICurrencyDAO): ICurrency;

  toDTO(currency: ICurrency, locale: Locale): ICurrencyDTO;
}
