import { JSONSchema, Model, Validator } from 'objection';

import { IContractor, IPublicContractor } from '../types';
import { ajvValidator } from '../../../libs/ajv';
import { contractorSchema } from './contractor.schema';

export class Contractor extends Model implements IContractor {
  static tableName = 'cf$.contractor';
  static jsonSchema = contractorSchema as JSONSchema;
  static idColumn = ['idProject', 'idContractor'];

  readonly idProject: number;
  readonly idContractor: number;
  readonly idUser: number;
  name: string;
  note: string | null;

  static createValidator(): Validator {
    return ajvValidator;
  }

  toPublicModel(): IPublicContractor {
    return {
      id: String(this.idContractor),
      userId: String(this.idUser),
      name: this.name,
      note: this.note ?? '',
    };
  }
}
