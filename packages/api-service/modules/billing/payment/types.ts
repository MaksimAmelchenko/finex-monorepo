import { IRequestContext, TDateTime, TJson } from '../../../types/app';
import { TUUid } from '../../../../frontend/src/app/types';

export type Initiator = 'subscription' | 'user';
export type PaymentGateway = 'yookassa' | 'paypal';

export type PaymentStatus = 'waiting_for_capture' | 'pending' | 'succeeded' | 'canceled';

export interface IPaymentDAO {
  id: TUUid;
  userId: number;
  status: PaymentStatus;
  initiator: Initiator;
  planId: string;
  subscriptionId: TUUid | null;
  amount: number;
  currency: string;
  startAt: TDateTime;
  endAt: TDateTime;
  gateway: PaymentGateway;
  gatewayPaymentId: string | null;
  gatewayResponses: TJson[];
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IPaymentEntity {
  id: TUUid;
  userId: string;
  status: PaymentStatus;
  initiator: Initiator;
  planId: string;
  subscriptionId: TUUid | null;
  amount: number;
  currency: string;
  startAt: TDateTime;
  endAt: TDateTime;
  gateway: PaymentGateway;
  gatewayPaymentId: string | null;
  gatewayResponses: TJson[];
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IPayment extends IPaymentEntity {}

export interface CreatePaymentRepositoryData {
  status: PaymentStatus;
  initiator: Initiator;
  subscriptionId: TUUid | null;
  planId: string;
  amount: number;
  currency: string;
  startAt: TDateTime;
  endAt: TDateTime;
  gateway: PaymentGateway;
  gatewayPaymentId: string;
  gatewayResponses: TJson[];
}

export type CreatePaymentServiceData = CreatePaymentRepositoryData;

export interface UpdatePaymentRepositoryChanges {
  status?: PaymentStatus;
  subscriptionId?: TUUid;
  gatewayResponse?: TJson;
}

export type UpdatePaymentServiceChanges = UpdatePaymentRepositoryChanges;

export interface PaymentRepository {
  createPayment(ctx: IRequestContext, userId: string, data: CreatePaymentRepositoryData): Promise<IPaymentDAO>;

  getPayment(ctx: IRequestContext, userId: string, paymentId: TUUid): Promise<IPaymentDAO | undefined>;

  getPaymentByGatewayPaymentId(
    ctx: IRequestContext,
    userId: string,
    gatewayPaymentId: string
  ): Promise<IPaymentDAO | undefined>;

  getInitPayment(ctx: IRequestContext, userId: string, subscriptionId: string): Promise<IPaymentDAO | undefined>;

  updatePayment(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    paymentId: TUUid,
    changes: UpdatePaymentRepositoryChanges
  ): Promise<IPaymentDAO>;
}

export interface PaymentService {
  createPayment(ctx: IRequestContext<unknown, true>, userId: string, data: CreatePaymentServiceData): Promise<IPayment>;

  getPayment(ctx: IRequestContext<unknown, true>, userId: string, paymentId: TUUid): Promise<IPayment>;

  getPaymentByGatewayPaymentId(ctx: IRequestContext, userId: string, gatewayPaymentId: string): Promise<IPayment>;

  getInitPayment(ctx: IRequestContext, userId: string, subscriptionId: string): Promise<IPayment>;

  updatePayment(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    paymentId: TUUid,
    changes: UpdatePaymentServiceChanges
  ): Promise<IPayment>;
}

export interface PaymentMapper {
  toDomain(payment: IPaymentDAO): IPayment;
}
