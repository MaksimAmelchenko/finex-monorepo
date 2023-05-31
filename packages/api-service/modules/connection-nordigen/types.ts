import { ILogger, IRequestContext, TDateTime, TUrl } from '../../types/app';
import {
  ProviderAccountStatus,
  IConnection,
  IProviderAccount,
  IAccount,
  INormalizedTransaction,
} from '../connection/types';
import { ITransaction } from '../transaction/types';

export interface NordigenService {}

export interface IInstitution {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo: TUrl;
  supported_payments: unknown;
  supported_features: string[];
}

export interface IInstitutionDTO {
  id: string;
  name: string;
  bic: string;
  logo: TUrl;
}

export interface IRequisitionDAO {
  projectId: number;
  id: string;
  userId: number;
  institutionId: string;
  requisitionId: string;
  connectionId: string | null;
  status: string;
  responses: IRequisitionNordigen[];
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IRequisitionEntity extends Omit<IRequisitionDAO, 'projectId' | 'userId'> {
  projectId: string;
  userId: string;
}

export interface IRequisition extends IRequisitionEntity {}

/*
* {
   "id":"2dea1b84-97b0-4cb4-8805-302c227587c8",
   "created":"2021-10-25T16:41:09.753Z",
   "max_historical_days":180,
   "access_valid_for_days":30,
   "access_scope":[
      "balances",
      "details",
      "transactions"
   ],
   "accepted":"",
   "institution_id":"REVOLUT_REVOGB21"
}
* */
export interface IAgreement {
  id: string;
  created: TDateTime;
  max_historical_days: number;
  access_valid_for_days: number;
  access_scope: 'balances' | 'details' | 'transactions';
  accepted: TDateTime | '';
  institution_id: string;
}

/*
* Status short	Status long	Description	Stage*
CR	CREATED	Requisition has been successfully created	1
GC	GIVING_CONSENT	End-user is giving consent at Nordigen's consent screen	2
UA	UNDERGOING_AUTHENTICATION	End-user is redirected to the financial institution for authentication	3
RJ	REJECTED	Either SSN verification has failed or end-user has entered incorrect credentials	4
SA	SELECTING_ACCOUNTS	End-user is selecting accounts	5
GA	GRANTING_ACCESS	End-user is granting access to their account information	6
LN	LINKED	Account has been successfully linked to requisition	7
SU	SUSPENDED	Requisition is suspended due to numerous consecutive errors that happened while accessing its accounts	8
EX	EXPIRED	Access to accounts has expired as set in End User Agreement	9
* */

export interface IRequisitionNordigen {
  id: string;
  created: TDateTime;
  redirect: TUrl;
  status: 'CR' | 'GC' | 'UA' | 'RJ' | 'SA' | 'GA' | 'LN' | 'SU' | 'EX';
  institution_id: string;
  agreement: string;
  reference: string;
  accounts: string[];
  user_language: string;
  link: TUrl;
  ssn: null;
  account_selection: boolean;
  redirect_immediate: boolean;
}

// https://nordigen.com/en/docs/account-information/output/accounts/
export interface IAccountNordigen {
  id: string;
  bban?: string;
  bic?: string;
  // https://open-banking.pass-consulting.com/json_ExternalCashAccountType1Code.html
  cashAccountType?: string;
  currency: string;
  details?: string;
  displayName?: string;
  iban?: string;
  linkedAccounts?: string;
  msisdn?: string;
  name?: string;
  ownerAddressUnstructured?: string;
  ownerName?: string;
  product?: string;
  resourceId?: string;
  status?: ProviderAccountStatus;
  usage?: 'PRIV' | 'ORGA';
}

// https://nordigen.com/en/docs/account-information/output/transactions/
export interface INordigenTransaction {
  // Unique transaction identifier given by financial institution
  transactionId?: string;
  // Transaction identifier given by Nordigen
  internalTransactionId: string;
  bookingDate?: string;
  valueDate?: string;
  transactionAmount: INordigenTransactionAmount;
  // Name of the creditor if a "Debited" transaction
  creditorName?: string;
  // Name of the debtor if a "Credited" transaction
  debtorName?: string;
  remittanceInformationStructured?: string;
  remittanceInformationStructuredArray?: string[];
  remittanceInformationUnstructured?: string;
  remittanceInformationUnstructuredArray?: string[];
  additionalInformation?: string;
  bankTransactionCode: string;
  debtorAccount?: INordigenDebtorAccount;
  mandateId?: string;
  creditorId?: string;
  creditorAccount?: INordigenCreditorAccount;
  currencyExchange?: INordigenCurrencyExchange[];

  additionalInformationStructured?: string;
  balanceAfterTransaction?: string;
  bookingDateTime?: string;
  checkId?: string;
  creditorAgent?: string;
  debtorAgent?: string;
  endToEndId?: string;
  entryReference?: string;
  merchantCategoryCode?: string;
  proprietaryBankTransactionCode?: string;
  purposeCode?: string;
  ultimateCreditor?: string;
  ultimateDebtor?: string;
  valueDateTime?: string;
}

export interface INordigenDebtorAccount {
  iban: string;
}

export interface INordigenCreditorAccount {
  iban: string;
}

export interface INordigenCurrencyExchange {
  sourceCurrency: string;
  exchangeRate: string;
  unitCurrency: string;
  targetCurrency: string;
  quotationDate: string;
}
export interface INordigenTransactionAmount {
  amount: string;
  currency: string;
}

//
export interface INordigenTransactions {
  booked: INordigenTransaction[];
  pending: INordigenTransaction[];
}

export interface CreateRequisitionRepositoryData {
  id: string;
  requisitionId: string;
  institutionId: string;
  status: string;
  responses: IRequisitionNordigen[];
}

export interface CreateRequisitionServiceData {
  institutionId: string;
  origin: TUrl;
  isRetrieveMaxPeriodTransactions: boolean;
}

export interface UpdateRequisitionRepositoryChanges {
  connectionId?: string;
  status?: string;
  response?: IRequisitionNordigen;
}

export type TransformationFunction = (
  log: ILogger,
  account: IAccount,
  transactions: INordigenTransactions,
  options: {
    cashAccountId?: string;
    accounts: Array<{
      providerAccountName: string;
      accountId: string;
    }>;
  }
) => INormalizedTransaction[];

export interface NordigenRepository {
  createRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateRequisitionRepositoryData
  ): Promise<IRequisitionDAO>;

  getRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    requisitionId: string
  ): Promise<IRequisitionDAO | undefined>;

  getRequisitionByConnectionId(
    cx: IRequestContext<unknown, true>,
    projectId: string,
    connectionId: string
  ): Promise<IRequisitionDAO | undefined>;

  updateRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    requisitionId: string,
    changes: UpdateRequisitionRepositoryChanges
  ): Promise<IRequisitionDAO>;

  deleteRequisition(ctx: IRequestContext<unknown, true>, projectId: string, requisitionId: string): Promise<void>;
}

export interface NordigenService {
  getInstitution(ctx: IRequestContext<unknown, true>, institutionId: string): Promise<IInstitution>;

  getInstitutions(ctx: IRequestContext<unknown, true>, country: string): Promise<IInstitution[]>;

  getAccounts(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string
  ): Promise<IProviderAccount[]>;

  createRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateRequisitionServiceData
  ): Promise<IRequisition>;

  getRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string
  ): Promise<IRequisition>;

  getRequisitionByConnectionId(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<IRequisition>;

  completeRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string
  ): Promise<IConnection>;

  deleteRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string
  ): Promise<void>;
}

export interface NordigenMapper {
  toInstitutionDTO(institution: IInstitution): IInstitutionDTO;
  toRequisition(requisitionDAO: IRequisitionDAO): IRequisition;
}

export interface NordigenETL {
  transform(
    log: ILogger,
    connection: IConnection,
    account: IAccount,
    transactions: INordigenTransactions,
    options: {
      cashAccountId?: string;
    }
  ): INormalizedTransaction[];
}
