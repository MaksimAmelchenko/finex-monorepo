import { IMoney } from '../types';

export class Money implements IMoney {
  projectId: string;
  id: string;
  userId: string;
  currencyCode: string | null;
  name: string;
  symbol: string;
  precision: number | null;
  isEnabled: boolean;
  sorting: number | null;

  constructor(data: IMoney) {
    this.projectId = data.projectId;
    this.id = data.id;
    this.userId = data.userId;
    this.currencyCode = data.currencyCode;
    this.name = data.name;
    this.symbol = data.symbol;
    this.precision = data.precision;
    this.isEnabled = data.isEnabled;
    this.sorting = data.sorting;
  }
}
