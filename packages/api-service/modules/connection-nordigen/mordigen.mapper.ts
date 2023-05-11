import { IInstitution, IInstitutionDTO, IRequisition, IRequisitionDAO, NordigenMapper } from './types';
import { Requisition } from './models/requisition';

class NordigenMapperImpl implements NordigenMapper {
  toRequisition(requisitionDAO: IRequisitionDAO): IRequisition {
    const { projectId, userId, ...requisition } = requisitionDAO;

    return new Requisition({
      projectId: String(projectId),
      userId: String(userId),
      ...requisition,
    });
  }

  toInstitutionDTO(institution: IInstitution): IInstitutionDTO {
    const { id, name, bic, logo } = institution;
    return {
      id,
      name,
      bic,
      logo,
    };
  }
}

export const nordigenMapper = new NordigenMapperImpl();
