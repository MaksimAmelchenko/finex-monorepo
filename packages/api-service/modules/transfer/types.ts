import { IRequestContext, Permissions, TDate, TDateTime } from '../../types/app';
import { ICashFlowDAO } from '../cahsflow/types';
import { ICashFlowItemDAO } from '../cahsflow-item/types';

export interface ITransferDAO {
  projectId: number;
  userId: number;
  id: number;
  amount: number;
  moneyId: number;
  accountFromId: number;
  accountToId: number;
  fee: number | null;
  moneyFeeId: number | null;
  accountFeeId: number | null;
  transferDate: TDate;
  reportPeriod: TDate;
  note: string | null;
  tags: number[] | null;
  updatedAt: TDateTime;
  cashflowTypeId: number;
}

export type ITransferEntity = {
  userId: string;
  id: string;
  amount: number;
  moneyId: string;
  accountFromId: string;
  accountToId: string;
  fee: number | null;
  moneyFeeId: string | null;
  accountFeeId: string | null;
  transferDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
  updatedAt: TDateTime;
};

export type ITransfer = ITransferEntity;

export type ITransferDTO = {
  userId: string;
  id: string;
  amount: number;
  moneyId: string;
  accountFromId: string;
  accountToId: string;
  transferDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  moneyFeeId: string | null;
  accountFeeId: string | null;
  note: string;
  tags: string[];
  updatedAt: TDateTime;
};

export interface FindTransfersRepositoryQuery {
  limit?: number;
  offset?: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  accountsFrom?: string[];
  accountsTo?: string[];
  tags?: string[];
}

export type FindTransfersServiceQuery = FindTransfersRepositoryQuery;

export interface FindTransfersRepositoryResponse {
  transfers: ICashFlowDAO[];
  metadata: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface FindTransfersServiceResponse {
  transfers: ITransfer[];
  metadata: {
    offset: number;
    limit: number;
    total: number;
  };
}

export type CreateTransferRepositoryData = {
  amount: number;
  moneyId: string;
  accountFromId: string;
  accountToId: string;
  transferDate: TDate;
  reportPeriod: TDate;
  fee?: number;
  moneyFeeId?: string;
  accountFeeId?: string;
  note?: string;
  tags?: string[];
};

export type CreateTransferServiceData = CreateTransferRepositoryData;

export type UpdateTransferRepositoryChanges = Partial<{
  amount: number;
  moneyId: string;
  accountFromId: string;
  accountToId: string;
  isFee: false;
  fee: number;
  moneyFeeId: string;
  accountFeeId: string;
  transferDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
}>;

export type UpdateTransferServiceChanges = UpdateTransferRepositoryChanges;

export interface TransferRepository {
  findTransfers(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindTransfersServiceQuery
  ): Promise<FindTransfersRepositoryResponse>;
}

export interface TransferService {
  createTransfer(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreateTransferServiceData
  ): Promise<ITransfer>;

  getTransfer(ctx: IRequestContext, projectId: string, userId: string, transferId: string): Promise<ITransfer>;

  findTransfers(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    query: FindTransfersServiceQuery
  ): Promise<FindTransfersServiceResponse>;

  updateTransfer(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    transferId: string,
    changes: UpdateTransferServiceChanges
  ): Promise<ITransfer>;

  deleteTransfer(ctx: IRequestContext, projectId: string, userId: string, transferId: string): Promise<void>;
}

export interface TransferMapper {
  toDTO(transfer: ITransfer): ITransferDTO;
  toDomain(
    cashFlow: ICashFlowDAO,
    cashFlowItems: ICashFlowItemDAO[],
    transferCategoryId: string,
    transferFeeCategoryId: string
  ): ITransfer;
}
