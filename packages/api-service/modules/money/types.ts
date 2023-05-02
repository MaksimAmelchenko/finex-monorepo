export interface IMoneyDAO {
  idProject: number;
  idMoney: number;
  idUser: number;
  currencyCode: string | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;
}

export interface IMoneyEntity extends Omit<IMoneyDAO, 'idProject' | 'idMoney' | 'idUser'> {
  projectId: string;
  id: string;
  userId: string;
}

export interface IMoney extends IMoneyEntity {}

export interface IMoneyDTO extends Omit<IMoney, 'projectId'> {}

export type CreateMoneyRepositoryData = {
  currencyCode?: string | null;
  name: string;
  symbol: string;
  precision?: number | null;
  isEnabled: boolean;
  sorting?: number | null;
};

export type CreateMoneyServiceData = CreateMoneyRepositoryData;

export type UpdateMoneyRepositoryChanges = Partial<{
  currencyCode: string | null;
  name: string;
  symbol: string;
  precision: number;
  isEnabled: boolean;
  sorting: number;
}>;

export type UpdateMoneyServiceChanges = UpdateMoneyRepositoryChanges;

export interface MoneyRepository {}

export interface MoneyService {}

export interface MoneyMapper {
  toDomain(moneyDAO: IMoneyDAO): IMoney;

  toDTO(money: IMoney): IMoneyDTO;
}
