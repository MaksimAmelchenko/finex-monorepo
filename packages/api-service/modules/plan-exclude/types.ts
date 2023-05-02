import { IRequestContext, TDate } from '../../types/app';

export enum ActionType {
  PlannedOperationEntered = 1,
  Cancellation = 2,
}

export interface IPlanExcludeDAO {
  idProject: number;
  idPlan: number;
  idUser: number;
  dexclude: TDate;
  actionType: ActionType;
}

export interface IPlanExcludeEntity {
  projectId: string;
  planId: string;
  userId: string;
  exclusionDate: TDate;
  actionType: ActionType;
}

export interface IPlanExclude extends IPlanExcludeEntity {}

export interface CreatePlanExcludeRepositoryData {
  exclusionDate: TDate;
  actionType: ActionType;
}

export interface PlanExcludeRepository {
  createPlanExclude(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    planId: string,
    data: CreatePlanExcludeRepositoryData
  ): Promise<void>;
}

export interface PlanExcludeService {
  cancelPlan(ctx: IRequestContext, projectId: string, userId: string, planId: string, exclusionDate: TDate);
  usePlan(ctx: IRequestContext, projectId: string, userId: string, planId: string, exclusionDate: TDate);
}

export interface PlanExcludeMapper {
  toDomain(planExcludeDAO: IPlanExcludeDAO): IPlanExclude;
}
