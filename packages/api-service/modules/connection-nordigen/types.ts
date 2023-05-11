import { IRequestContext, TDateTime, TUrl } from '../../types/app';
import { ProviderAccountStatus, IConnection, IProviderAccount } from '../connection/types';

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
  userId: number;
  id: string;
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
export interface IAgreementNordigen {
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

/*
{
  "id":"8126e9fb-93c9-4228-937c-68f0383c2df7",
  "redirect":"http://www.yourwebpage.com",
  "status":{
  "short":"CR",
    "long":"CREATED",
    "description":"Requisition has been succesfully created"
},
  "agreements":"2dea1b84-97b0-4cb4-8805-302c227587c8",
  "accounts":[],
  "reference":"124151",
  "user_language":"EN",
  "link":"https://ob.nordigen.com/psd2/start/3fa85f64-5717-4562-b3fc-2c963f66afa6/{$INSTITUTION_ID}"
}
*/

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
export interface ITransactionNordigen {
  additionalInformation?: string;
  additionalInformationStructured?: string;
  balanceAfterTransaction?: string;
  bankTransactionCode?: string;
  bookingDate?: string;
  bookingDateTime?: string;
  checkId?: string;
  creditorAccount?: string;
  creditorAgent?: string;
  creditorId?: string;
  creditorName?: string;
  currencyExchange?: string;
  debtorAccount?: string;
  debtorAgent?: string;
  debtorName?: string;
  endToEndId?: string;
  entryReference?: string;
  internalTransactionId?: string;
  mandateId?: string;
  merchantCategoryCode?: string;
  proprietaryBankTransactionCode?: string;
  purposeCode?: string;
  remittanceInformationStructured?: string;
  remittanceInformationStructuredArray?: string;
  remittanceInformationUnstructured?: string;
  remittanceInformationUnstructuredArray?: string;
  transactionAmount: {
    amount: number;
    currency: string;
  };
  transactionId?: string;
  ultimateCreditor?: string;
  ultimateDebtor?: string;
  valueDate?: string;
  valueDateTime?: string;
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
}

export interface UpdateRequisitionRepositoryChanges {
  connectionId?: string;
  status?: string;
  response?: IRequisitionNordigen;
}

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
    userId: string,
    requisitionId: string
  ): Promise<IRequisitionDAO | undefined>;

  getRequisitionByConnectionId(
    cx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    connectionId: string
  ): Promise<IRequisitionDAO | undefined>;

  updateRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string,
    changes: UpdateRequisitionRepositoryChanges
  ): Promise<IRequisitionDAO>;

  deleteRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    requisitionId: string
  ): Promise<void>;
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
