export type TUrl = string;
export type TDate = string;
export type TDateTime = string;
export type TTime = string;
export type THtml = string;
export type TText = string;

export interface IDateRange {
  since: TDate;
  until: TDate;
}

export enum Permit {
  Read = 1,
  Write = 3,
  Owner = 7,
}

export type Sign = 1 | -1;

export interface Metadata {
  limit: number;
  offset: number;
  total: number;
  totalPlanned: number;
}
