import { IApiAccount } from './account';
import { IApiContractor } from './contractor';
import { IMoneyDTO } from './money';
import { IApiTag } from './tag';
import { Permit, TDate } from './index';
import { User } from '../stores/models/user';
import { IApiUnit } from './unit';
import { ICategoryDTO } from './category';
import { IParamsDTO } from './params';

export interface IApiProject {
  id: string;
  name: string;
  note: string;
  permit: Permit;
  editors: string[];
  userId: string;
}

export interface IProject {
  id: string;
  user: User;
  name: string;
  note: string;
  permit: Permit;
  editors: User[];
}

export interface GetProjectsResponse {
  projects: IApiProject[];
}

export interface CreateProjectData {
  name: string;
  note?: string;
  editors?: string[];
}

export interface CreateProjectResponse {
  project: IApiProject;
}

export type UpdateProjectChanges = Partial<{
  name: string;
  note: string;
  editors?: string[];
}>;

export interface UpdateProjectResponse {
  project: IApiProject;
}

export type CopyProjectParams = {
  name: string;
};

export interface CopyProjectResponse {
  project: IApiProject;
}

export type MergeProjectParams = {
  projects: string[];
};

export interface MergeProjectResponse {}

export interface UseProjectResponse {
  accounts: IApiAccount[];
  contractors: IApiContractor[];
  categories: ICategoryDTO[];
  tags: IApiTag[];
  units: IApiUnit[];
  moneys: IMoneyDTO[];
  params: IParamsDTO;
}
