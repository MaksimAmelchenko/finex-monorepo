import { IRequestContext, Locale, TI18nField } from '../../types/app';

export interface ICategoryPrototypeDAO {
  idCategoryPrototype: number;
  name: TI18nField<string>;
  parent: number | null;
  isEnabled: boolean;
  isSystem: boolean;
}

export interface ICategoryPrototypeEntity extends Omit<ICategoryPrototypeDAO, 'idCategoryPrototype' | 'parent'> {
  id: string;
  parent: string | null;
}

export interface ICategoryPrototype extends ICategoryPrototypeEntity {}

export interface ICategoryPrototypeDTO extends Omit<ICategoryPrototypeEntity, 'name'> {
  name: string;
}

export interface CategoryPrototypeRepository {
  getCategoryPrototype(ctx: IRequestContext, categoryPrototypeId: string): Promise<ICategoryPrototypeDAO | undefined>;

  getCategoryPrototypes(ctx: IRequestContext): Promise<ICategoryPrototypeDAO[]>;
}

export interface CategoryPrototypeService {
  getCategoryPrototype(ctx: IRequestContext, categoryPrototypeId: string): Promise<ICategoryPrototype>;

  getCategoryPrototypes(ctx: IRequestContext): Promise<ICategoryPrototype[]>;
}

export interface CategoryPrototypeMapper {
  toDomain(categoryPrototypeDAO: ICategoryPrototypeDAO): ICategoryPrototype;

  toDTO(categoryPrototype: ICategoryPrototype, locale: Locale): ICategoryPrototypeDTO;
}
