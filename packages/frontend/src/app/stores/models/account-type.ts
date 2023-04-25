import { IAccountType } from '../../types/account-type';

export class AccountType implements IAccountType {
  readonly id: string;
  readonly name: string;

  constructor({ id, name }: IAccountType) {
    this.id = id;
    this.name = name;
  }
}
