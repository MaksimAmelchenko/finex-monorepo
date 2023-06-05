import { JSONSchema, Model, Validator } from 'objection';

import { ITagDAO } from '../types';
import { ajvValidator } from '../../../libs/ajv';
import { tagDAOSchema } from './tag-dao.schema';

export class TagDAO extends Model implements ITagDAO {
  static tableName = 'cf$.tag';
  static jsonSchema = tagDAOSchema as JSONSchema;
  static idColumn = ['idProject', 'idTag'];

  readonly idProject: number;
  readonly idTag: number;
  readonly idUser: number;
  name: string;

  static createValidator(): Validator {
    return ajvValidator;
  }
}
