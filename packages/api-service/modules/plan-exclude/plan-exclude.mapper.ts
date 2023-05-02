import { IPlanExclude, IPlanExcludeDAO, PlanExcludeMapper } from './types';
import { PlanExclude } from './models/plan-exclude';

class PlanExcludeMapperImpl implements PlanExcludeMapper {
  toDomain(planExcludeDAO: IPlanExcludeDAO): IPlanExclude {
    const { idProject, idPlan, idUser, dexclude, actionType } = planExcludeDAO;
    return new PlanExclude({
      projectId: String(idProject),
      planId: String(idPlan),
      userId: String(idUser),
      exclusionDate: dexclude,
      actionType,
    });
  }
}

export const planExcludeMapper = new PlanExcludeMapperImpl();
