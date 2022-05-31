import { User } from '../stores/models/user';

export interface IAPIContractor {
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
  contractors: IAPIContractor[];
}

export interface CreateContractorData {
  name: string;
  note?: string;
}

export interface CreateContractorResponse {
  contractor: IAPIContractor;
}

export type UpdateContractorChanges = Partial<{
  name: string;
  note: string;
}>;

export interface UpdateContractorResponse {
  contractor: IAPIContractor;
}
