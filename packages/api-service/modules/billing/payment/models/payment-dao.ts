import * as uuid from 'uuid';
import { JSONSchema, Model, Validator } from 'objection';

import { AccessPeriodDAO } from '../../access-period/models/access-period-dao';
import { Initiator, IPaymentDAO, PaymentGateway, PaymentStatus } from '../types';
import { TDateTime, TJson } from '../../../../types/app';
import { ajvValidator } from '../../../../libs/ajv';
import { paymentDAOSchema } from './payment-dao.schema';

export class PaymentDAO extends Model implements IPaymentDAO {
  static tableName = 'billing$.payment';
  static jsonSchema = paymentDAOSchema as JSONSchema;
  static jsonAttributes = [];

  id: string;
  userId: number;
  status: PaymentStatus;

  initiator: Initiator;
  subscriptionId: string | null;
  planId: string;
  amount: number;
  currency: string;
  startAt: TDateTime;
  endAt: TDateTime;

  gateway: PaymentGateway;
  gatewayPaymentId: string | null;
  gatewayResponses: TJson[];

  createdAt: TDateTime;
  updatedAt: TDateTime;

  static createValidator(): Validator {
    return ajvValidator;
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);

    // for some reason 'this' does not contain inserted data (only id)
    // so we need to fetch it again
    const payment = (await PaymentDAO.query(queryContext.transaction).findById(this.id))!;

    if (payment.status === 'succeeded') {
      const { userId, planId, startAt, endAt } = payment;
      const id = uuid.v4();

      await AccessPeriodDAO.query(queryContext.transaction).insert({
        id,
        userId,
        planId,
        startAt,
        endAt,
      });
    }
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date().toISOString();
  }

  async $afterUpdate(opt, queryContext) {
    await super.$afterUpdate(opt, queryContext);
    if (opt.old.status === 'pending' && this.status === 'succeeded') {
      const { userId, planId, startAt, endAt } = opt.old;
      const id = uuid.v4();
      await AccessPeriodDAO.query(queryContext.transaction).insert({
        id,
        userId,
        planId,
        startAt,
        endAt,
      });
    }
  }
}
