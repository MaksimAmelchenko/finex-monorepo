import { JSONSchema, Model, Validator } from 'objection';

import { ICountryDAO } from '../types';
import { TI18nField } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';

import { countryDAOSchema } from './country-dao.schema';

export class CountryDAO extends Model implements ICountryDAO {
  static tableName = 'cf$_connection.country';
  static jsonSchema = countryDAOSchema as JSONSchema;
  static jsonAttributes = ['name'];

  code: string;
  name: TI18nField<string>;

  static createValidator(): Validator {
    return ajvValidator;
  }
}
