import { createAccount } from './methods/create-account';
import { deleteAccount } from './methods/delete-account';
import { getAccount } from './methods/get-account';
import { getAccounts } from './methods/get-accounts';
import { updateAccount } from './methods/update-account';

export const AccountService = {
  createAccount,
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
};
