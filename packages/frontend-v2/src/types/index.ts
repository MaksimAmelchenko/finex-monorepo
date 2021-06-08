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
