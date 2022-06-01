import { JSONSchema, Model, Validator } from 'objection';

import { ITag, IPublicTag } from '../types';
import { ajvValidator } from '../../../libs/ajv';
import { tagSchema } from './tag.schema';

export class Tag extends Model implements ITag {
  static tableName = 'cf$.tag';
  static jsonSchema = tagSchema as JSONSchema;
  static idColumn = ['idProject', 'idTag'];

  readonly idProject: number;
  readonly idTag: number;
  readonly idUser: number;
  name: string;

  static createValidator(): Validator {
    return ajvValidator;
  }

  toPublicModel(): IPublicTag {
    return {
      id: String(this.idTag),
      userId: String(this.idUser),
      name: this.name,
    };
  }
}
