export interface ICurrency {
  idCurrency: number;
  name: string;
  shortName: string;
  symbol: string;
  code: string;
}

export type IPublicCurrency = {
  id: string;
  name: string;
  shortName: string;
  symbol: string;
  code: string;
};
