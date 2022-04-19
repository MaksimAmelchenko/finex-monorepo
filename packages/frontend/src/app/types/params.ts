import { TDate } from './index';

export interface IParamsRaw {
  dashboard: {
    dBegin: TDate;
    dEnd: TDate;
  };
}

export interface IParams {
  dashboard: {
    dBegin: TDate;
    dEnd: TDate;
  };
}
