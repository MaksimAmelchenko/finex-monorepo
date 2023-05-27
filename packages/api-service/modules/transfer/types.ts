import { IRequestContext, Permissions, TDate, TDateTime } from '../../types/app';
import { ICashFlowDAO } from '../cash-flow/types';
import { ICashFlowItemDAO } from '../cash-flow-item/types';

export interface ITransferDAO {
  id: number;
  userId: number;
  amount: number;
  moneyId: number;
  fromAccountId: number;
  toAccountId: number;
  transferDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  feeMoneyId: number | null;
  feeAccountId: number | null;
  note: string | null;
  tags: number[] | null;
  updatedAt: TDateTime;
}

export type ITransferEntity = {
  id: string;
  userId: string;
  amount: number;
  moneyId: string;
  fromAccountId: string;
  toAccountId: string;
  fee: number | null;
  feeMoneyId: string | null;
  feeAccountId: string | null;
  transferDate: TDate;
  reportPeriod: TDate;
  note: string;
  tags: string[];
  updatedAt: TDateTime;
};

export type ITransfer = ITransferEntity;

export type ITransferDTO = {
  id: string;
  userId: string;
  amount: number;
  moneyId: string;
  fromAccountId: string;
  toAccountId: string;
  transferDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  feeMoneyId: string | null;
  feeAccountId: string | null;
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
  fromAccounts?: string[];
  toAccounts?: string[];
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
  fromAccountId: string;
  toAccountId: string;
  transferDate: TDate;
  reportPeriod: TDate;
  fee?: number;
  feeMoneyId?: string;
  feeAccountId?: string;
  note?: string;
  tags?: string[];
};

export type CreateTransferServiceData = CreateTransferRepositoryData;

export type UpdateTransferRepositoryChanges = Partial<{
  amount: number;
  moneyId: string;
  fromAccountId: string;
  toAccountId: string;
  isFee: false;
  fee: number;
  feeMoneyId: string;
  feeAccountId: string;
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

  createTransfer(
    ctx: IRequestContext<unknown, false>,
    projectId: string,
    userId: string,
    data: CreateTransferServiceData
  ): Promise<ITransferDAO>;

  getTransfer(
    ctx: IRequestContext<unknown, false>,
    projectId: string,
    userId: string,
    transferId: string
  ): Promise<ITransferDAO>;

  getTransferCategoryId(ctx: IRequestContext, projectId: string): Promise<string>;

  getTransferFeeCategoryId(ctx: IRequestContext, projectId: string): Promise<string>;
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

  toDAO(
    cashFlow: ICashFlowDAO,
    cashFlowItems: ICashFlowItemDAO[],
    transferCategoryId: string,
    transferFeeCategoryId: string
  ): ITransferDAO;

  toDomain(transferDAO: ITransferDAO): ITransfer;
}
