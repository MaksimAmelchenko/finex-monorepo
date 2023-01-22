import { IRequestContext, TDateTime } from '../../../types/app';

export interface IAccessPeriodDAO {
  id: string;
  userId: number;
  planId: string;
  startAt: TDateTime;
  endAt: TDateTime;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IAccessPeriodEntity {
  id: string;
  userId: string;
  planId: string;
  startAt: TDateTime;
  endAt: TDateTime;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IAccessPeriod extends IAccessPeriodEntity {}

export interface CreateAccessPeriodRepositoryData {
  planId: string;
  startAt: TDateTime;
  endAt: TDateTime;
}

export type CreateAccessPeriodServiceData = CreateAccessPeriodRepositoryData;

export interface AccessPeriodRepository {
  getAccessPeriod(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    accessPeriodId: string
  ): Promise<IAccessPeriodDAO | undefined>;

  createAccessPeriod(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    data: CreateAccessPeriodRepositoryData
  ): Promise<IAccessPeriodDAO>;
}

export interface AccessPeriodService {
  getAccessPeriod(ctx: IRequestContext<unknown, true>, userId: string, accessPeriodId: string): Promise<IAccessPeriod>;
  createAccessPeriod(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    data: CreateAccessPeriodServiceData
  ): Promise<IAccessPeriod>;
}

export interface AccessPeriodMapper {
  toDomain(accessPeriod: IAccessPeriodDAO): IAccessPeriod;
}
