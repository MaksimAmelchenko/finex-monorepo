import { ApiRepository } from '../../core/other-stores/api-repository';
import { IContractorsApi } from '../contractors-repository';
import {
  CreateContractorData,
  CreateContractorResponse,
  GetContractorsResponse,
  UpdateContractorChanges,
  UpdateContractorResponse,
} from '../../types/contractor';

export class ContractorsApi extends ApiRepository implements IContractorsApi {
  static override storeName = 'ContractorsApi';

  getContractors(): Promise<GetContractorsResponse> {
    return this.fetch<GetContractorsResponse>({
      method: 'GET',
      url: '/v2/contractors',
    });
  }

  createContractor(data: CreateContractorData): Promise<CreateContractorResponse> {
    return this.fetch<CreateContractorResponse>({
      method: 'POST',
      url: '/v2/contractors',
      body: data,
    });
  }

  updateContractor(contractorId: string, changes: UpdateContractorChanges): Promise<UpdateContractorResponse> {
    return this.fetch<CreateContractorResponse>({
      method: 'PATCH',
      url: `/v2/contractors/${contractorId}`,
      body: changes,
    });
  }

  deleteContractor(contractorId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/contractors/${contractorId}`,
    });
  }
}
