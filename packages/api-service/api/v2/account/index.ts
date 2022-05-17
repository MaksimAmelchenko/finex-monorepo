import { getRestApi } from '../../../libs/rest-api';

import { createAccount } from './create-account';
import { deleteAccount } from './delete-account';
import { getAccounts } from './get-accounts';
import { updateAccount } from './update-account';

export const accountApi = getRestApi([
  //
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
]);
