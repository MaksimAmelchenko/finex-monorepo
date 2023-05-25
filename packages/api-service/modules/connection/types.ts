import { IRequestContext, Locale, Sign, TDate, TDateTime, TI18nField, TUrl } from '../../types/app';
import { CashFlowType } from '../cash-flow/types';

export enum ConnectionProvider {
  Nordigen = 'nordigen',
}

export interface ICountryDAO {
  code: string;
  name: TI18nField<string>;
}

export interface ICountryEntity extends ICountryDAO {}

export interface ICountry extends ICountryEntity {}

export interface ICountryDTO extends Omit<ICountryEntity, 'name'> {
  name: string;
}

export interface IConnectionDAO {
  projectId: number;
  id: string;
  userId: number;
  institutionId: string;
  institutionName: string;
  institutionLogo: TUrl;
  provider: ConnectionProvider;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IConnectionEntity extends Omit<IConnectionDAO, 'projectId' | 'userId'> {
  projectId: string;
  userId: string;
  accounts: IAccount[];
}

export interface IConnection extends IConnectionEntity {}

export interface IConnectionDTO
  extends Omit<IConnection, 'projectId' | 'userId' | 'accounts' | 'createdAt' | 'updatedAt' | 'institutionId'> {
  accounts: IAccountDTO[];
}

export interface IAccountDAO {
  projectId: number;
  id: string;
  userId: number;
  connectionId: string;
  providerAccountId: string;
  providerAccountName: string;
  providerAccountProduct: string | null;
  accountId: number | null;
  syncFrom: TDate | null;
  lastSyncedAt: TDateTime | null;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IAccount extends Omit<IAccountDAO, 'projectId' | 'userId' | 'accountId'> {
  projectId: string;
  accountId: string | null;
  userId: string;
}

export interface IAccountDTO
  extends Omit<
    IAccount,
    | 'projectId'
    | 'userId'
    | 'connectionId'
    | 'providerAccountStatus'
    | 'createdAt'
    | 'updatedAt'
    | 'providerAccountProduct'
  > {
  providerAccountProduct: string;
}

export interface IProviderAccount {
  id: string;
  name: string;
  // https://open-banking.pass-consulting.com/json_ExternalCashAccountType1Code.html
  cashAccountType?: CashAccountType;
  currency: string;
  product?: string;
  status?: ProviderAccountStatus;
}

export interface CreateConnectionRepositoryData {
  institutionId: string;
  institutionName: string;
  institutionLogo: TUrl;
  provider: ConnectionProvider;
}

export interface CreateConnectionServiceData extends CreateConnectionRepositoryData {}

export interface IInstitutionDTO {
  id: string;
  name: string;
  bic: string;
  logo: TUrl;
  provider: ConnectionProvider;
}

export interface CreateAccountRepositoryData {
  providerAccountId: string;
  providerAccountName: string;
  providerAccountProduct?: string;
  accountId?: string | null;
  syncFrom?: TDate | null;
}

export interface CreateAccountServiceData extends CreateAccountRepositoryData {}

export interface UpdateAccountRepositoryChanges {
  accountId?: string | null;
  syncFrom?: TDate | null;
  lastSyncedAt?: TDateTime;
}

export interface UpdateAccountServiceChanges extends UpdateAccountRepositoryChanges {}

export type CashAccountType =
  | 'CACC'
  | 'CASH'
  | 'CHAR'
  | 'CISH'
  | 'COMM'
  | 'CPAC'
  | 'LLSV'
  | 'LOAN'
  | 'MGLD'
  | 'MOMA'
  | 'NREX'
  | 'ODFT'
  | 'ONDP'
  | 'OTHR'
  | 'SACC'
  | 'SLRY'
  | 'SVGS'
  | 'TAXE'
  | 'TRAN'
  | 'TRAS';

export enum ProviderAccountStatus {
  Enabled = 'enabled',
  Deleted = 'deleted',
  Blocked = 'blocked',
}

export interface INormalizedTransaction {
  // nordigen transaction id
  transactionId: string;
  transactionDate: TDate;
  amount: number;
  currency: string;
  cashFlow: INormalizedTransactionCashFlow | INormalizedTransactionTransfer;
  transformationName: string;
  source: any;
}

export interface INormalizedTransactionCashFlow {
  cashFlowType: CashFlowType;
  contractorName?: string;
  note?: string;
  items: Array<{
    sign: Sign;
    accountId: string;
    cashFlowItemDate: TDate;
    amount: number;
    currency: string;
    note?: string;
  }>;
}

export interface INormalizedTransactionTransfer {
  cashFlowType: CashFlowType;
  amount: number;
  currency: string;
  fromAccountId: string;
  toAccountId: string;
  transferDate: TDate;
  note?: string;
}
export function isTransactionCashFlow(
  cashFlow: INormalizedTransactionCashFlow | INormalizedTransactionTransfer
): cashFlow is INormalizedTransactionCashFlow {
  return cashFlow.cashFlowType === CashFlowType.IncomeExpense;
}

export function isTransactionTransfer(
  cashFlow: INormalizedTransactionCashFlow | INormalizedTransactionTransfer
): cashFlow is INormalizedTransactionTransfer {
  return cashFlow.cashFlowType === CashFlowType.Transfer;
}

export interface ITransactionDAO {
  projectId: number;
  providerTransactionId: string;
  userId: number;
  cashFlowId: number | null;
  amount: number;
  currency: string;
  transactionDate: TDate;
  transformationName: string;
  source: any;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface ITransactionEntity extends Omit<ITransactionDAO, 'projectId' | 'userId' | 'cashFlowId'> {
  projectId: string;
  userId: string;
  cashFlowId: string | null;
}

export interface ITransaction extends ITransactionEntity {}

export interface ICreateTransactionData {
  providerTransactionId: string;
  cashFlowId: string | null;
  transactionDate: TDate;
  amount: number;
  currency: string;
  transformationName: string;
  source: any;
}

export interface ConnectionRepository {
  getCountries(ctx: IRequestContext<unknown, true>): Promise<ICountryDAO[]>;

  getConnections(ctx: IRequestContext<unknown, true>, projectId: string): Promise<IConnectionDAO[]>;

  getConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    connectionId: string
  ): Promise<IConnectionDAO | undefined>;

  createConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateConnectionRepositoryData
  ): Promise<IConnectionDAO>;

  deleteConnection(ctx: IRequestContext<unknown, true>, projectId: string, connectionId: string): Promise<void>;

  createAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string,
    data: CreateAccountRepositoryData
  ): Promise<IAccountDAO>;

  getAccounts(ctx: IRequestContext<unknown, true>, projectId: string, connectionId: string): Promise<IAccountDAO[]>;

  getAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    accountId: string
  ): Promise<IAccountDAO | undefined>;

  updateAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    accountId: string,
    changes: UpdateAccountRepositoryChanges
  ): Promise<IAccountDAO>;

  createTransaction(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: ICreateTransactionData
  ): Promise<ITransactionDAO>;

  getTransaction(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    transactionId: string
  ): Promise<ITransactionDAO | undefined>;
}

export interface ConnectionService {
  getCountries(ctx: IRequestContext<unknown, true>): Promise<ICountry[]>;

  getConnections(ctx: IRequestContext<unknown, true>, projectId: string, userId: string): Promise<IConnection[]>;

  getConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<IConnection>;

  createConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateConnectionServiceData
  ): Promise<IConnection>;

  deleteConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<void>;

  createAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string,
    data: CreateAccountServiceData
  ): Promise<IAccount>;

  updateAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    accountId: string,
    changes: UpdateAccountServiceChanges
  ): Promise<IAccount>;

  syncAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string,
    accountId: string
  ): Promise<void>;
}

export interface ConnectionMapper {
  toCountry(countryDAO: ICountryDAO): ICountry;
  toCountryDTO(country: ICountry, locale: Locale): ICountryDTO;

  toAccount(accountDAO: IAccountDAO): IAccount;
  toAccountDTO(account: IAccount): IAccountDTO;

  toConnection(connectionDAO: IConnectionDAO, connectionAccount: IAccountDAO[]): IConnection;
  toConnectionDTO(connection: IConnection): IConnectionDTO;

  toTransaction(transactionDAO: ITransactionDAO): ITransaction;
}
