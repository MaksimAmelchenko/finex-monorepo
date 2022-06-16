import { User } from '../stores/models/user';

export interface IApiContractor {
  id: string;
  name: string;
  note: string;
  userId: string;
}

export interface IContractor {
  id: string;
  user: User;
  name: string;
  note: string;
}

export interface GetContractorsResponse {
  contractors: IApiContractor[];
}

export interface CreateContractorData {
  name: string;
  note?: string;
}

export interface CreateContractorResponse {
  contractor: IApiContractor;
}

export type UpdateContractorChanges = Partial<{
  name: string;
  note: string;
}>;

export interface UpdateContractorResponse {
  contractor: IApiContractor;
}
