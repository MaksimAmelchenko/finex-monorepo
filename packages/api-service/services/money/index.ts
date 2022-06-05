import { createMoney } from './methods/create-money';
import { deleteMoney } from './methods/delete-money';
import { getMoneys } from './methods/get-moneys';
import { sortMoneys } from './methods/sort-moneys';
import { updateMoney } from './methods/update-money';

export const MoneyService = {
  createMoney,
  deleteMoney,
  getMoneys,
  sortMoneys,
  updateMoney,
};
