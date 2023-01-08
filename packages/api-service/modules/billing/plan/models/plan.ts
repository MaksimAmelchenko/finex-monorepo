import { IPlanEntity, IPlan } from '../types';
import { TDateTime, TI18nField } from '../../../../types/app';
import { PaymentGateway } from '../../payment/types';

export class Plan implements IPlan {
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

  constructor({
    id,
    name,
    description,
    productName,
    duration,
    price,
    currency,
    isEnabled,
    isRenewable,
    availablePaymentGateways,
    paypalPlanId,
    createdAt,
    updatedAt,
  }: IPlanEntity) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.productName = productName;
    this.duration = duration;
    this.price = price;
    this.currency = currency;
    this.isEnabled = isEnabled;
    this.isRenewable = isRenewable;
    this.availablePaymentGateways = availablePaymentGateways;
    this.paypalPlanId = paypalPlanId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
