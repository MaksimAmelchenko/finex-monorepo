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

export interface ITransfer {
  user: User;
  id: string;
  amount: number;
  money: Money;
  accountFrom: Account;
  accountTo: Account;
  transferDate: TDate;
  reportPeriod: TDate;
  fee: number | null;
  moneyFee: Money | null;
  accountFee: Account | null;
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
  accountsFrom?: string;
  accountsTo?: string;
  tags?: string;
}

export interface GetTransfersResponse {
  transfers: ITransferDTO[];
  metadata: Metadata;
}

export interface CreateTransferData {
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
}

export interface CreateTransferResponse {
  transfer: ITransferDTO;
}

export type UpdateTransferChanges = Partial<{
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

export interface UpdateTransferResponse {
  transfer: ITransferDTO;
}

export interface ITransfersApi {
  getTransfers: (query: GetTransfersQuery) => Promise<GetTransfersResponse>;
  createTransfer: (data: CreateTransferData) => Promise<CreateTransferResponse>;
  updateTransfer: (transferId: string, changes: UpdateTransferChanges) => Promise<UpdateTransferResponse>;
  deleteTransfer: (transferId: string) => Promise<void>;
}
