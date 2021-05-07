import { IUser } from './user';

export interface ITagRaw {
  idTag: number;
  idUser: number;
  name: string;
}

export interface ITag {
  id: string;
  user: IUser;
  name: string;
}
