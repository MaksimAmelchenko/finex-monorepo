import { JSONSchema, Model, Validator } from 'objection';

import { ICurrencyDAO } from '../types';
import { TI18nField } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';

import { currencyDAOSchema } from './currency-dao.schema';

export class CurrencyDAO extends Model implements ICurrencyDAO {
  static tableName = 'cf$.currency';
  static jsonSchema = currencyDAOSchema as JSONSchema;
  static jsonAttributes = ['name'];

  code: string;
  name: TI18nField<string>;
  precision: number;
  symbol: string;

  static createValidator(): Validator {
    return ajvValidator;
  }
}
