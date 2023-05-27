import { Account } from '../stores/models/account';
import { Metadata, TDate, TDateTime } from './index';
import { Money } from '../stores/models/money';
import { Tag } from '../stores/models/tag';
import { User } from '../stores/models/user';

export type ITransferDTO = {
  userId: string;
  id: string;
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

export interface ITransfer {
  user: User;
  id: string;
  amount: number;
  money: Money;
  fromAccount: Account;
  toAccount: Account;
  transferDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  feeMoney: Money | null;
  feeAccount: Account | null;
  note: string;
  tags: Tag[];
  updatedAt: TDateTime;
}

export interface GetTransfersQuery {
  limit: number;
  offset: number;
  searchText?: string;
  startDate?: TDate;
  endDate?: TDate;
  fromAccounts?: string;
  toAccounts?: string;
  tags?: string;
}

export interface GetTransfersResponse {
  transfers: ITransferDTO[];
  metadata: Metadata;
}

export interface CreateTransferData {
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
}

export interface CreateTransferResponse {
  transfer: ITransferDTO;
}

export type UpdateTransferChanges = Partial<{
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

export interface UpdateTransferResponse {
  transfer: ITransferDTO;
}

export interface ITransfersApi {
  getTransfers: (query: GetTransfersQuery) => Promise<GetTransfersResponse>;
  createTransfer: (data: CreateTransferData) => Promise<CreateTransferResponse>;
  updateTransfer: (transferId: string, changes: UpdateTransferChanges) => Promise<UpdateTransferResponse>;
  deleteTransfer: (transferId: string) => Promise<void>;
}
