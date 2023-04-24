export interface ICurrencyDTO {
  code: string;
  name: string;
  precision: number;
  symbol: string;
}

export interface ICurrency extends ICurrencyDTO {}

export interface GetCurrenciesResponse {
  currencies: ICurrencyDTO[];
}

export interface ICurrenciesApi {
  getCurrencies: () => Promise<GetCurrenciesResponse>;
}
