import { IUnit } from './unit';
import { IUser } from './user';

export interface ICategoryPrototypeRaw {
  idCategoryPrototype: number;
  name: string;
  parent: number | null;
}

export interface ICategoryPrototype {
  id: string;
  name: string;
  parent: ICategoryPrototype | null;
}

export interface ICategoryRaw {
  idCategory: number;
  idCategoryPrototype: number | null;
  idUnit: number | null;
  idUser: number;
  isEnabled: boolean;
  isSystem: boolean;
  name: string;
  note: string;
  parent: number | null;
}

export interface ICategory {
  id: string;
  categoryPrototype: ICategoryPrototype | null;
  unit: IUnit | null;
  user: IUser;
  isEnabled: boolean;
  isSystem: boolean;
  name: string;
  note: string;
  parent: ICategory | null;
}
