import { IRequestContext, Locale, TDate, TDateTime, TI18nField, TUrl } from '../../types/app';

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
  userId: number;
  id: string;
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
  extends Omit<IConnection, 'projectId' | 'userId' | 'accounts' | 'createdAt' | 'updatedAt'> {
  accounts: IAccountDTO[];
}

export interface IAccountDAO {
  projectId: number;
  userId: number;
  id: string;
  connectionId: string;
  providerAccountId: string;
  providerAccountName: string;
  providerAccountProduct: string | null;
  accountId: number | null;
  syncFrom: TDate | null;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IAccount extends Omit<IAccountDAO, 'projectId' | 'userId' | 'accountId'> {
  projectId: string;
  userId: string;
  accountId: string | null;
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

export interface ConnectionRepository {
  getCountries(ctx: IRequestContext<unknown, true>): Promise<ICountryDAO[]>;

  getConnections(ctx: IRequestContext<unknown, true>, projectId: string, userId: string): Promise<IConnectionDAO[]>;

  getConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<IConnectionDAO | undefined>;

  createConnection(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateConnectionRepositoryData
  ): Promise<IConnectionDAO>;

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
    data: CreateAccountRepositoryData
  ): Promise<IAccountDAO>;

  getAccounts(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<IAccountDAO[]>;

  updateAccount(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    accountId: string,
    changes: UpdateAccountRepositoryChanges
  ): Promise<IAccountDAO>;
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
}

export interface ConnectionMapper {
  toCountry(countryDAO: ICountryDAO): ICountry;
  toCountryDTO(country: ICountry, locale: Locale): ICountryDTO;

  toAccount(accountDAO: IAccountDAO): IAccount;
  toAccountDTO(account: IAccount): IAccountDTO;

  toConnection(connectionDAO: IConnectionDAO, connectionAccount: IAccountDAO[]): IConnection;
  toConnectionDTO(connection: IConnection): IConnectionDTO;
}
