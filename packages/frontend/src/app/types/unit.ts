import { User } from '../stores/models/user';

export interface IAPIUnit {
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
  units: IAPIUnit[];
}

export interface CreateUnitData {
  name: string;
}

export interface CreateUnitResponse {
  unit: IAPIUnit;
}

export type UpdateUnitChanges = Partial<{
  name: string;
  note: string;
}>;

export interface UpdateUnitResponse {
  unit: IAPIUnit;
}
