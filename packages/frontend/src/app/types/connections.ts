import { TDate, TUrl } from './index';
import { Account } from '../stores/models/account';

export interface ICountryDTO {
  code: string;
  name: string;
}

export interface ICountry extends ICountryDTO {}

export interface IInstitutionDTO {
  id: string;
  name: string;
  bic: string;
  logo: string;
  gateway: string;
}

export interface IInstitution extends IInstitutionDTO {}

export interface IConnectionDTO {
  id: string;
  institutionName: string;
  institutionLogo: string;
  gateway: string;
  accounts: IAccountDTO[];
}

export interface IAccountDTO {
  id: string;
  providerAccountId: string;
  providerAccountName: string;
  providerAccountProduct: string;
  accountId: string | null;
  syncFrom: TDate | null;
}

export interface IConnection extends Omit<IConnectionDTO, 'accounts'> {
  accounts: IAccount[];
}

export interface IAccount {
  id: string;
  providerAccountId: string;
  providerAccountName: string;
  providerAccountProduct: string;
  account: Account | null;
  syncFrom: TDate | null;
}

export interface GetCountriesResponse {
  countries: ICountryDTO[];
}

export interface GetInstitutionsResponse {
  institutions: IInstitutionDTO[];
}

export interface GetConnectionsResponse {
  connections: IConnectionDTO[];
}

export interface CreateRequisitionResponse {
  link: TUrl;
}

export type UpdateConnectionAccountChanges = Partial<{
  accountId: string | null;
  syncFrom: TDate | null;
}>;

export interface UpdateConnectionAccountResponse {
  account: IAccountDTO;
}

export interface UnlinkConnectionAccountResponse extends UpdateConnectionAccountResponse {}

export interface CompleteRequisitionResponse {
  connectionId: string;
}

export interface IConnectionsApi {
  getConnections: () => Promise<GetConnectionsResponse>;
  deleteConnection: (connectionId: string) => Promise<void>;
  getCountries: () => Promise<GetCountriesResponse>;
  getInstitutions: (country: string) => Promise<GetInstitutionsResponse>;
  createNordigenRequisition(institutionId: string): Promise<CreateRequisitionResponse>;
  completeNordigenRequisition(requisitionId: string): Promise<CompleteRequisitionResponse>;
  updateConnectionAccount(
    connectionId: string,
    accountId: string,
    changes: UpdateConnectionAccountChanges
  ): Promise<UpdateConnectionAccountResponse>;

  unlinkConnectionAccount(connectionId: string, accountId: string): Promise<UnlinkConnectionAccountResponse>;
}
