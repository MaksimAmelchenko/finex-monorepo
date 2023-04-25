import { IAccountType, IAccountTypeEntity } from '../types';
import { TI18nField } from '../../../types/app';

export class AccountType implements IAccountType {
  id: string;
  name: TI18nField<string>;

  constructor({ id, name }: IAccountTypeEntity) {
    this.id = id;
    this.name = name;
  }
}
