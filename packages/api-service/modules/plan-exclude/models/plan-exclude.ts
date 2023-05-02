import { IPlanExclude, IPlanExcludeEntity } from '../types';
import { TDate } from '../../../types/app';

export class PlanExclude implements IPlanExclude {
  readonly projectId: string;
  readonly planId: string;
  readonly userId: string;
  readonly exclusionDate: TDate;
  readonly actionType: number;

  constructor({ projectId, planId, userId, exclusionDate, actionType }: IPlanExcludeEntity) {
    this.projectId = projectId;
    this.planId = planId;
    this.userId = userId;
    this.exclusionDate = exclusionDate;
    this.actionType = actionType;
  }
}
