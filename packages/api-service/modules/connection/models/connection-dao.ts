import { JSONSchema, Model, Validator } from 'objection';

import { ConnectionProvider, IConnectionDAO } from '../types';
import { TDateTime } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';
import { connectionDAOSchema } from './connection-dao.schema';

export class ConnectionDAO extends Model implements IConnectionDAO {
  static tableName = 'cf$_connection.connection';
  static jsonSchema = connectionDAOSchema as JSONSchema;
  static idColumn = ['projectId', 'userId', 'id'];

  readonly projectId: number;
  readonly userId: number;
  readonly id: string;
  readonly institutionId: string;
  readonly institutionName: string;
  readonly institutionLogo: string;
  readonly provider: ConnectionProvider;
  readonly createdAt: TDateTime;
  updatedAt: TDateTime;

  static createValidator(): Validator {
    return ajvValidator;
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date().toISOString();
  }
}
