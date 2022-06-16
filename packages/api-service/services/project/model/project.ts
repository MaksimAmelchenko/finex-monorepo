import { JSONSchema, Model, Validator } from 'objection';

import { IProject, IPublicProject } from '../types';
import { Permit } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';
import { projectSchema } from './project.schema';

export class Project extends Model implements IProject {
  static tableName = 'cf$.project';
  static jsonSchema = projectSchema as JSONSchema;
  static idColumn = ['idProject'];

  readonly idProject: number;
  readonly idUser: number;
  name: string;
  note: string | null;
  permit: Permit;
  editors: number[];

  static createValidator(): Validator {
    return ajvValidator;
  }

  toPublicModel(): IPublicProject {
    return {
      id: String(this.idProject),
      userId: String(this.idUser),
      name: this.name,
      note: this.note ?? '',
      permit: this.permit,
      editors: this.editors.map(String),
    };
  }
}
