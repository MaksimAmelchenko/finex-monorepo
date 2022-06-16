export interface IMoney {
  idProject: number;
  idMoney: number;
  idUser: number;
  idCurrency: number | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;
}

export type IPublicMoney = {
  id: string;
  currencyId: string | null;
  userId: string;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;
};

export type CreateMoneyGatewayData = {
  currencyId?: string | null;
  name: string;
  symbol: string;
  precision?: number | null;
  isEnabled: boolean;
  sorting?: number | null;
};

export type CreateMoneyServiceData = CreateMoneyGatewayData;

export type UpdateMoneyGatewayChanges = Partial<{
  currencyId: string | null;
  name: string;
  symbol: string;
  precision: number;
  isEnabled: boolean;
  sorting: number;
}>;

export type UpdateMoneyServiceChanges = UpdateMoneyGatewayChanges;
