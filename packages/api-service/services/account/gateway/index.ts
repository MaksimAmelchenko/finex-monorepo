import { createAccount } from './methods/create-account';
import { deleteAccount } from './methods/delete-account';
import { getAccount } from './methods/get-account';
import { getAccountPermits } from './methods/get-account-permits';
import { getAccounts } from './methods/get-accounts';
import { updateAccount } from './methods/update-account';

export const AccountGateway = {
  createAccount,
  deleteAccount,
  getAccount,
  getAccountPermits,
  getAccounts,
  updateAccount,
};
