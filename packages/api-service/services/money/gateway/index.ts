import { createMoney } from './methods/create-money';
import { deleteMoney } from './methods/delete-money';
import { getMoney } from './methods/get-money';
import { getMoneys } from './methods/get-moneys';
import { sortMoneys } from './methods/sort-moneys';
import { updateMoney } from './methods/update-money';

export const MoneyGateway = {
  createMoney,
  deleteMoney,
  getMoney,
  getMoneys,
  sortMoneys,
  updateMoney,
};
