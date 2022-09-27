import { TDate } from './index';
import { Tag } from '../stores/models/tag';
import { User } from '../stores/models/user';

export interface CancelPlanParams {
  excludedDate: TDate;
}

export enum RepetitionType {
  No = 0,
  Daily = 1,
  Monthly = 2,
  Quarterly = 3,
  Annually = 4,
}

export enum TerminationType {
  Never = 0,
  After = 1,
  EndDate = 2,
}

export interface IPlan {
  id: string;

  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: RepetitionType;
  repetitionDays: number[] | null;
  terminationType: TerminationType | null;
  repetitionCount: number | null;
  endDate: TDate | null;
  note: string;
  operationNote: string;
  operationTags: Tag[];
  markerColor: string | null;
  user: User;
}
