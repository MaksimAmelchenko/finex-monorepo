import { JSONSchema, Model, Validator } from 'objection';

import { ICurrency, IPublicCurrency } from '../types';
import { ajvValidator } from '../../../libs/ajv';
import { currencySchema } from './currency.schema';

export class Currency extends Model implements ICurrency {
  static tableName = 'cf$.currency';
  static jsonSchema = currencySchema as JSONSchema;
  static idColumn = ['idCurrency'];

  readonly idCurrency: number;
  name: string;
  shortName: string;
  symbol: string;
  code: string;

  static createValidator(): Validator {
    return ajvValidator;
  }

  toPublicModel(): IPublicCurrency {
    return {
      id: String(this.idCurrency),
      name: this.name,
      shortName: this.shortName,
      symbol: this.symbol,
      code: this.code,
    };
  }
}
