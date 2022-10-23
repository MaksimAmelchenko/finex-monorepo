import { Project } from '../stores/models/project';
import { User } from '../stores/models/user';

export interface IProfileDTO {
  id: string;
  name: string;
  email: string;
  projectId: string;
  timeout: string;
  currencyRateSourceId: string;
}

export interface IProfile {
  user: User;
  name: string;
  email: string;
  // currencyRateSource: CurrencyRateSource;
  project: Project | null;
  timeout: string;
}

export type UpdateProfileChanges = Partial<{
  name: string;
  projectId: string;
  timeout: string;
  currencyRateSourceId: string;
}>;

export interface UpdateProfileResponse {
  profile: IProfileDTO;
}

export type DeleteProfileParams = {
  password: string;
};

export interface IProfileApi {
  update: (changes: UpdateProfileChanges) => Promise<UpdateProfileResponse>;
  remove: (params: DeleteProfileParams) => Promise<void>;
}
