import { User } from '../stores/models/user';

export interface IApiUnit {
  id: string;
  name: string;
  userId: string;
}

export interface IUnit {
  id: string;
  user: User;
  name: string;
}

export interface GetUnitsResponse {
  units: IApiUnit[];
}

export interface CreateUnitData {
  name: string;
}

export interface CreateUnitResponse {
  unit: IApiUnit;
}

export type UpdateUnitChanges = Partial<{
  name: string;
  note: string;
}>;

export interface UpdateUnitResponse {
  unit: IApiUnit;
}
