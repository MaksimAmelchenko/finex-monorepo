import { IRequestContext, Locale, TI18nField } from '../../types/app';

export interface IAccountTypeDAO {
  id: number;
  name: TI18nField<string>;
}

export interface IAccountTypeEntity extends Omit<IAccountTypeDAO, 'id'> {
  id: string;
}

export interface IAccountType extends IAccountTypeEntity {}

export interface IAccountTypeDTO extends Omit<IAccountTypeEntity, 'name'> {
  name: string;
}

export interface AccountTypeRepository {
  getAccountType(ctx: IRequestContext, categoryPrototypeId: string): Promise<IAccountTypeDAO | undefined>;

  getAccountTypes(ctx: IRequestContext): Promise<IAccountTypeDAO[]>;
}

export interface AccountTypeService {
  getAccountType(ctx: IRequestContext, categoryPrototypeId: string): Promise<IAccountType>;

  getAccountTypes(ctx: IRequestContext): Promise<IAccountType[]>;
}

export interface AccountTypeMapper {
  toDomain(categoryPrototypeDAO: IAccountTypeDAO): IAccountType;

  toDTO(categoryPrototype: IAccountType, locale: Locale): IAccountTypeDTO;
}
