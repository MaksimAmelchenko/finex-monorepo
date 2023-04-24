import { Currency } from './models/currency';
import { CurrencyMapper, ICurrency, ICurrencyDAO, ICurrencyDTO } from './types';
import { Locale } from '../../types/app';
import { t } from '../../libs/t';

class CurrencyMapperImpl implements CurrencyMapper {
  toDomain(currencyDAO: ICurrencyDAO): ICurrency {
    const { code, name, precision, symbol } = currencyDAO;

    return new Currency({
      code,
      name,
      precision,
      symbol,
    });
  }

  toDTO(currency: ICurrency, locale: Locale): ICurrencyDTO {
    const { code, name, precision, symbol } = currency;

    return {
      code,
      name: t(name, locale),
      precision,
      symbol,
    };
  }
}

export const currencyMapper = new CurrencyMapperImpl();
