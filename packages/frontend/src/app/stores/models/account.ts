import { IAccount } from '../../types/account';
import { IAccountType } from '../../types/account-type';
import { IUser } from '../../types/user';
import { Permit } from '../../types';

export class Account implements IAccount {
  readonly id: string;
  accountType: IAccountType;
  readonly user: IUser;
  isEnabled: boolean;
  name: string;
  note: string;
  readonly permit: Permit;
  readers: IUser[];
  writers: IUser[];

  constructor({ id, accountType, isEnabled, user, name, note, permit, readers, writers }: IAccount) {
    this.id = id;
    this.accountType = accountType;
    this.user = user;
    this.isEnabled = isEnabled;
    this.name = name;
    this.note = note;
    this.permit = permit;
    this.readers = readers;
    this.writers = writers;
  }
}
