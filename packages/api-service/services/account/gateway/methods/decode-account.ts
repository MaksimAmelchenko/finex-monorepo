import { IAccount } from '../../types';

export function decodeAccount(account: any): IAccount {
  return {
    id: String(account.idAccount),
    name: account.name,
    accountTypeId: String(account.idAccountType),
    isEnabled: account.isEnabled,
    note: account.note,
    readers: account.readers.map(String),
    writers: account.writers.map(String),
    permit: account.permit,
    userId: String(account.idUser),
  };
}
