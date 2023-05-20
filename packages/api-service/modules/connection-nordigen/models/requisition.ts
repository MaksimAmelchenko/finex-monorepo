import { IRequisition, IRequisitionEntity, IRequisitionNordigen } from '../types';
import { TDateTime } from '../../../types/app';

export class Requisition implements IRequisition {
  projectId: string;
  userId: string;
  id: string;
  institutionId: string;
  requisitionId: string;
  connectionId: string | null;
  status: string;
  responses: IRequisitionNordigen[];
  createdAt: TDateTime;
  updatedAt: TDateTime;

  constructor(data: IRequisitionEntity) {
    this.projectId = data.projectId;
    this.userId = data.userId;
    this.id = data.id;
    this.institutionId = data.institutionId;
    this.requisitionId = data.requisitionId;
    this.connectionId = data.connectionId;
    this.status = data.status;
    this.responses = data.responses;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
