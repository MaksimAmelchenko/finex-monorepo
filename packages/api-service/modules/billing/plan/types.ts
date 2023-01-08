import { IRequestContext, Locale, TDateTime, TI18nField } from '../../../types/app';
import { PaymentGateway } from '../payment/types';

export interface IPlanDAO {
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
}

export interface IPlanEntity extends IPlanDAO {}

export interface IPlan extends IPlanEntity {}

export interface IPlanDTO
  extends Omit<IPlanEntity, 'name' | 'description' | 'productName' | 'createdAt' | 'updatedAt'> {
  name: string;
  description: string;
}

export interface CreatePlanRepositoryData {
  name: TI18nField<string>;
  description: TI18nField<string>;
  productName: TI18nField<string>;
  duration: string;
  price: number;
  currency: string;
  isEnabled: boolean;
  isRenewable: boolean;
  availablePaymentGateways: PaymentGateway[];
  paypalPlanId: string | null;
}

export type CreatePlanServiceData = CreatePlanRepositoryData;

export interface PlanRepository {
  getPlan(ctx: IRequestContext, planId: string): Promise<IPlanDAO | undefined>;

  getPlans(ctx: IRequestContext): Promise<IPlanDAO[]>;
}

export interface PlanService {
  getPlan(ctx: IRequestContext, planId: string): Promise<IPlan>;

  getPlans(ctx: IRequestContext): Promise<IPlan[]>;
}

export interface PlanMapper {
  toDomain(plan: IPlanDAO): IPlan;

  toDTO(plan: IPlan, locale: Locale): IPlanDTO;
}
