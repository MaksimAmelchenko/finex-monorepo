import { JSONSchema, Model, Validator } from 'objection';

import { ISubscriptionDAO, SubscriptionStatus } from '../types';
import { PaymentGateway } from '../../payment/types';
import { TDateTime, TJson } from '../../../../types/app';
import { ajvValidator } from '../../../../libs/ajv';

import { subscriptionDAOSchema } from './subscription-dao.schema';

export class SubscriptionDAO extends Model implements ISubscriptionDAO {
  static tableName = 'billing$.subscription';
  static jsonSchema = subscriptionDAOSchema as JSONSchema;
  static jsonAttributes = ['paymentMetadata'];

  id: string;
  userId: number;
  planId: string;
  status: SubscriptionStatus;
  gateway: PaymentGateway | null;
  gatewaySubscriptionId: string | null;
  gatewayMetadata: TJson | null;
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
