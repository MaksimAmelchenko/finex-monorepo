import { IRequestContext, TDateTime, TJson } from '../../../types/app';

export type Initiator = 'subscription' | 'user';
export type PaymentGateway = 'yookassa' | 'paypal';

export type PaymentStatus = 'waiting_for_capture' | 'pending' | 'succeeded' | 'canceled';

export interface IPaymentDAO {
  id: string;
  userId: number;
  status: PaymentStatus;
  initiator: Initiator;
  planId: string;
  subscriptionId: string | null;
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
  id: string;
  userId: string;
  status: PaymentStatus;
  initiator: Initiator;
  planId: string;
  subscriptionId: string | null;
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
  subscriptionId: string | null;
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
  subscriptionId?: string;
  gatewayResponse?: TJson;
}

export type UpdatePaymentServiceChanges = UpdatePaymentRepositoryChanges;

export interface PaymentRepository {
  createPayment(ctx: IRequestContext, userId: string, data: CreatePaymentRepositoryData): Promise<IPaymentDAO>;

  getPayment(ctx: IRequestContext, userId: string, paymentId: string): Promise<IPaymentDAO | undefined>;

  getPaymentByGatewayPaymentId(
    ctx: IRequestContext,
    userId: string,
    gatewayPaymentId: string
  ): Promise<IPaymentDAO | undefined>;

  getInitPayment(ctx: IRequestContext, userId: string, subscriptionId: string): Promise<IPaymentDAO | undefined>;

  updatePayment(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    paymentId: string,
    changes: UpdatePaymentRepositoryChanges
  ): Promise<IPaymentDAO>;
}

export interface PaymentService {
  createPayment(ctx: IRequestContext<unknown, true>, userId: string, data: CreatePaymentServiceData): Promise<IPayment>;

  getPayment(ctx: IRequestContext<unknown, true>, userId: string, paymentId: string): Promise<IPayment>;

  getPaymentByGatewayPaymentId(ctx: IRequestContext, userId: string, gatewayPaymentId: string): Promise<IPayment>;

  getInitPayment(ctx: IRequestContext, userId: string, subscriptionId: string): Promise<IPayment>;

  updatePayment(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    paymentId: string,
    changes: UpdatePaymentServiceChanges
  ): Promise<IPayment>;
}

export interface PaymentMapper {
  toDomain(payment: IPaymentDAO): IPayment;
}
