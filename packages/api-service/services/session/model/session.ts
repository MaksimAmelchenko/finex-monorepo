import { JSONSchema, Model, Validator } from 'objection';

import { ISession } from '../types';
import { TDateTime } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';
import { sessionSchema } from './session.schema';

export class Session extends Model implements ISession {
  static tableName = 'core$.session';
  static jsonSchema = sessionSchema as JSONSchema;

  readonly id: string;
  readonly idUser: number;
  idProject: number;
  isActive: boolean;
  ip: string;
  requestsCount: number;
  lastAccessTime: TDateTime;
  timeout: string;
  userAgent: string;
  createdAt: TDateTime;
  updatedAt: TDateTime;

  static createValidator(): Validator {
    return ajvValidator;
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
