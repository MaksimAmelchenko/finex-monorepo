import { JSONSchema, Model, Validator } from 'objection';

import { IPlanDAO } from '../types';
import { PaymentGateway } from '../../payment/types';
import { TDateTime, TI18nField } from '../../../../types/app';
import { ajvValidator } from '../../../../libs/ajv';

import { planDAOSchema } from './plan-dao.schema';

export class PlanDAO extends Model implements IPlanDAO {
  static tableName = 'billing$.plan';
  static jsonSchema = planDAOSchema as JSONSchema;
  static jsonAttributes = ['name', 'description', 'productName'];

  id: string;
  name: TI18nField<string>;
  description: TI18nField<string>;
  productName: TI18nField<string>;
  duration: string;
  price: number | null;
  currency: string | null;
  isEnabled: boolean;
  isRenewable: boolean;
  availablePaymentGateways: PaymentGateway[];
  paypalPlanId: string | null;
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
