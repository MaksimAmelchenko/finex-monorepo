import { JSONSchema, Model, Validator } from 'objection';

import { IMoneyDAO } from '../types';
import { ajvValidator } from '../../../libs/ajv';

import { moneyDAOSchema } from './money-dao.schema';

export class MoneyDAO extends Model implements IMoneyDAO {
  static tableName = 'cf$.money';
  static jsonSchema = moneyDAOSchema as JSONSchema;
  static jsonAttributes = [];
  static idColumn = ['idProject', 'idMoney'];

  readonly idProject: number;
  readonly idMoney: number;
  readonly idUser: number;
  currencyCode: string | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;

  static createValidator(): Validator {
    return ajvValidator;
  }
}
