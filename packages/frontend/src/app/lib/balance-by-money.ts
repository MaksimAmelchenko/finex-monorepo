import { Money } from '../stores/models/money';
import { Sign } from '../types';

interface TransactionLike {
  sign: Sign;
  amount: number;
  money: Money;
}

export interface Balance {
  money: Money;
  income: number;
  expense: number;
}

export function balanceByMoney(items: TransactionLike[]): Balance[] {
  const total = items.reduce<Map<string, Balance>>((acc, { money, sign, amount }) => {
    if (!acc.has(money.id)) {
      acc.set(money.id, { money, income: 0, expense: 0 });
    }
    if (sign === 1) {
      acc.get(money.id)!.income += amount;
    } else {
      acc.get(money.id)!.expense += amount;
    }

    return acc;
  }, new Map());

  return Array.from(total.values());
}
