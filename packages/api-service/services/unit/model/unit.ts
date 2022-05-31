import { JSONSchema, Model, Validator } from 'objection';

import { IUnit, IPublicUnit } from '../types';
import { ajvValidator } from '../../../libs/ajv';
import { unitSchema } from './unit.schema';

export class Unit extends Model implements IUnit {
  static tableName = 'cf$.unit';
  static jsonSchema = unitSchema as JSONSchema;
  static idColumn = ['idProject', 'idUnit'];

  readonly idProject: number;
  readonly idUnit: number;
  readonly idUser: number;
  name: string;

  static createValidator(): Validator {
    return ajvValidator;
  }

  toPublicModel(): IPublicUnit {
    return {
      id: String(this.idUnit),
      userId: String(this.idUser),
      name: this.name,
    };
  }
}
