import { IRequestContext, TDateTime } from '../../../types/app';
import { TUUid } from '../../../../frontend/src/app/types';

export interface IAccessPeriodDAO {
  id: TUUid;
  userId: number;
  planId: string;
  startAt: TDateTime;
  endAt: TDateTime;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IAccessPeriodEntity {
  id: TUUid;
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
    accessPeriodId: TUUid
  ): Promise<IAccessPeriodDAO | undefined>;

  createAccessPeriod(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    data: CreateAccessPeriodRepositoryData
  ): Promise<IAccessPeriodDAO>;
}

export interface AccessPeriodService {
  getAccessPeriod(ctx: IRequestContext<unknown, true>, userId: string, accessPeriodId: TUUid): Promise<IAccessPeriod>;
  createAccessPeriod(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    data: CreateAccessPeriodServiceData
  ): Promise<IAccessPeriod>;
}

export interface AccessPeriodMapper {
  toDomain(accessPeriod: IAccessPeriodDAO): IAccessPeriod;
}
