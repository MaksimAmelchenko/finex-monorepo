import { TDate } from './index';

export interface IParamsDTO {
  outcome: {
    accountDailyBalances: {
      startDate: TDate;
      endDate: TDate;
    };
  };
}

export interface IParams {
  outcome: {
    accountDailyBalances: {
      startDate: TDate;
      endDate: TDate;
    };
  };
}
