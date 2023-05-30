import { ApiRepository } from '../../core/other-stores/api-repository';
import {
  CompleteRequisitionResponse,
  CreateRequisitionResponse,
  GetConnectionsResponse,
  GetCountriesResponse,
  GetInstitutionsResponse,
  IAccountDTO,
  UpdateConnectionAccountChanges,
  UpdateConnectionAccountResponse,
} from '../../types/connections';
import { IConnectionsApi } from '../../types/connections';

export class ConnectionsApi extends ApiRepository implements IConnectionsApi {
  static override storeName = 'ConnectionsApi';

  getConnections(): Promise<GetConnectionsResponse> {
    return this.fetch<GetConnectionsResponse>({
      method: 'GET',
      url: `/v1/connections`,
    });
  }

  deleteConnection(connectionId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v1/connections/${connectionId}`,
    });
  }

  getCountries(): Promise<GetCountriesResponse> {
    return this.fetch<GetCountriesResponse>({
      method: 'GET',
      url: `/v1/connections/countries`,
    });
  }

  getInstitutions(country: string): Promise<GetInstitutionsResponse> {
    return this.fetch<GetInstitutionsResponse>({
      method: 'GET',
      url: `/v1/connections/institutions?country=${country}`,
    });
  }

  createNordigenRequisition(
    institutionId: string,
    options: { isRetrieveMaxPeriodTransactions: boolean }
  ): Promise<CreateRequisitionResponse> {
    const { isRetrieveMaxPeriodTransactions } = options;
    return this.fetch<CreateRequisitionResponse>({
      method: 'POST',
      url: '/v1/connections/nordigen/requisitions',
      body: {
        institutionId,
        isRetrieveMaxPeriodTransactions,
      },
    });
  }

  completeNordigenRequisition(requisitionId: string): Promise<CompleteRequisitionResponse> {
    return this.fetch<CompleteRequisitionResponse>({
      method: 'POST',
      url: `/v1/connections/nordigen/requisitions/${requisitionId}/complete`,
    });
  }

  updateConnectionAccount(
    connectionId: string,
    connectionAccountId: string,
    changes: UpdateConnectionAccountChanges
  ): Promise<UpdateConnectionAccountResponse> {
    return this.fetch<UpdateConnectionAccountResponse>({
      method: 'PATCH',
      url: `/v1/connections/${connectionId}/accounts/${connectionAccountId}`,
      body: changes,
    });
  }

  unlinkConnectionAccount(connectionId: string, connectionAccountId: string): Promise<UpdateConnectionAccountResponse> {
    return this.fetch<UpdateConnectionAccountResponse>({
      method: 'PUT',
      url: `/v1/connections/${connectionId}/accounts/${connectionAccountId}/unlink`,
    });
  }
}
