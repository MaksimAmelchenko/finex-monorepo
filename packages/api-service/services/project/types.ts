import { Permit } from '../../types/app';

export interface IProject {
  idProject: number;
  idUser: number;
  name: string;
  note: string | null;
  permit: Permit;
  editors: number[];
}

export type IPublicProject = {
  id: string;
  name: string;
  note: string;
  userId: string;
  permit: Permit;
  editors: string[];
};

export type CreateProjectGatewayData = {
  name: string;
  note?: string;
};

export type CreateProjectServiceData = CreateProjectGatewayData & {
  editors?: string[];
};

export type UpdateProjectGatewayChanges = Partial<{
  name: string;
  note: string;
}>;

export type UpdateProjectServiceChanges = UpdateProjectGatewayChanges & {
  editors?: string[];
};
