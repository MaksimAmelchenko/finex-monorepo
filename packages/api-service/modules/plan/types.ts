import { TDate } from '../../types/app';

export interface IPlanDAO {
  projectId: number;
  id: number;

  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;

  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;

  note: string | null;

  operationNote: string | null;
  operationTags: number[] | null;
  markerColor: string | null;

  userId: number;
}

export interface IPlanEntity {
  id: string;
  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;

  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;

  note: string;

  operationNote: string;
  operationTags: string[];
  markerColor: string | null;
  userId: string;
}

export interface IPlan extends IPlanEntity {}

export interface CreatePlanRepositoryData {
  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;

  repetitionDays?: number[] | null;
  terminationType?: number | null;
  repetitionCount?: number | null;
  endDate?: TDate | null;

  note?: string;

  operationNote?: string;
  operationTags?: string[];
  markerColor?: string | null;
}

export type UpdatePlanRepositoryChanges = Partial<{
  startDate: TDate;
  reportPeriod: TDate;
  repetitionType: number;

  repetitionDays: number[] | null;
  terminationType: number | null;
  repetitionCount: number | null;
  endDate: TDate | null;

  note: string;

  operationNote: string;
  operationTags: number[];
  markerColor: string | null;
}>;
