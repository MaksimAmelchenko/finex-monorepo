import { Money } from './models/money';
import { MoneyMapper, IMoney, IMoneyDAO, IMoneyDTO } from './types';

class MoneyMapperImpl implements MoneyMapper {
  toDomain(moneyDAO: IMoneyDAO): IMoney {
    const { idProject, idMoney, idUser, currencyCode, name, symbol, precision, isEnabled, sorting } = moneyDAO;

    return new Money({
      projectId: String(idProject),
      id: String(idMoney),
      userId: String(idUser),
      currencyCode,
      name,
      symbol,
      precision,
      isEnabled,
      sorting,
    });
  }

  toDTO(money: IMoney): IMoneyDTO {
    const { id, userId, currencyCode, name, symbol, precision, isEnabled, sorting } = money;

    return {
      id,
      userId,
      currencyCode,
      name,
      symbol,
      precision,
      isEnabled,
      sorting,
    };
  }
}

export const moneyMapper = new MoneyMapperImpl();
