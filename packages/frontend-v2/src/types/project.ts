import { Permit } from './index';
import { IUser } from './user';

export interface IProjectRaw {
  idProject: number;
  idUser: number;
  name: string;
  note: string;
  permit: Permit;
  writers: number[];
}

export interface IProject {
  id: string;
  user: IUser;
  name: string;
  note: string;
  permit: Permit;
  writers: IUser[];
}
