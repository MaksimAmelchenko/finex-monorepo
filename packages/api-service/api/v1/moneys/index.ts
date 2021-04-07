import { getRestApi } from '../../../libs/rest-api';

import { createMoney } from './create-money';
import { deleteMoney } from './delete-money';
import { getMoney } from './get-money';
import { getMoneys } from './get-moneys';
import { sortMoneys } from './sort-moneys';
import { updateMoney } from './update-money';

export const moneysApi = getRestApi([
  //
  createMoney,
  deleteMoney,
  getMoney,
  getMoneys,
  sortMoneys,
  updateMoney,
]);
