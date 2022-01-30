import { IAccountType } from '../../types/account-type';

export class AccountType implements IAccountType {
  readonly id: string;
  readonly shortName: string;
  readonly name: string;

  constructor({ id, shortName, name }: IAccountType) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
  }
}
