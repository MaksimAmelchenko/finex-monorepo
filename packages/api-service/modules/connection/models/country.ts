import { ICountry, ICountryEntity } from '../types';
import { TI18nField } from '../../../types/app';

export class Country implements ICountry {
  code: string;
  name: TI18nField<string>;

  constructor({ code, name }: ICountryEntity) {
    this.code = code;
    this.name = name;
  }
}
