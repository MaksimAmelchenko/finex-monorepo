export interface IUser {
  idUser: number;
  name: string;
  email: string;
  password: string;
  tz: string | null;
  timeout: string;
  idHousehold: number;
  idProject: number | null;
  idCurrencyRateSource: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProfile {
  id: string;
  name: string;
  email: string;
  tz: string | null;
  timeout: string;
  projectId: string | null;
  currencyRateSourceId: string;
}

export interface IPublicUser {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserGatewayData {
  name: string;
  email: string;
  password: string;
  householdId: string;
  currencyRateSourceId: string;
}

export type UpdateUserGatewayChanges = Partial<{
  name: string;
  password: string;
  tz: string;
  timeout: string;
  projectId: string;
  currencyRateSourceId: string;
}>;
