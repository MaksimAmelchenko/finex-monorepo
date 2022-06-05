import { JSONSchema, Model, Validator } from 'objection';

import { IMoney, IPublicMoney } from '../types';
import { ajvValidator } from '../../../libs/ajv';

import { moneySchema } from './money.schema';

export class Money extends Model implements IMoney {
  static tableName = 'cf$.money';
  static jsonSchema = moneySchema as JSONSchema;
  static idColumn = ['idProject', 'idMoney'];

  readonly idProject: number;
  readonly idMoney: number;
  readonly idUser: number;
  idCurrency: number | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;

  static createValidator(): Validator {
    return ajvValidator;
  }

  toPublicModel(): IPublicMoney {
    return {
      id: String(this.idMoney),
      currencyId: this.idCurrency ? String(this.idCurrency) : null,
      userId: String(this.idUser),
      name: this.name,
      symbol: this.symbol,
      precision: this.precision,
      isEnabled: this.isEnabled,
      sorting: this.sorting,
    };
  }
}
