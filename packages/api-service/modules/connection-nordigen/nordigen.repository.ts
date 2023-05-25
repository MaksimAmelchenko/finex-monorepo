import {
  CreateRequisitionRepositoryData,
  IRequisitionDAO,
  NordigenRepository,
  UpdateRequisitionRepositoryChanges,
} from './types';
import { IRequestContext } from '../../types/app';
import { NotFoundError } from '../../libs/errors';
import { RequisitionDAO } from './models/requisition-dao';
import { knex } from '../../knex';

class NordigenRepositoryImpl implements NordigenRepository {
  async createRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateRequisitionRepositoryData
  ): Promise<IRequisitionDAO> {
    ctx.log.trace({ data }, 'try to create requisition');

    const { id, requisitionId, institutionId, status, responses } = data;
    const requisition = await RequisitionDAO.query(ctx.trx).insertAndFetch({
      projectId: Number(projectId),
      userId: Number(userId),
      id,
      requisitionId,
      institutionId,
      status,
      responses,
    });

    ctx.log.info({ requisitionId: requisition.id }, 'created requisition');
    return requisition;
  }

  async getRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    requisitionId: string
  ): Promise<IRequisitionDAO | undefined> {
    ctx.log.trace({ requisitionId }, 'try to get requisition');
    return RequisitionDAO.query(ctx.trx).findById([Number(projectId), requisitionId]);
  }

  async getRequisitionByConnectionId(
    cx: IRequestContext<unknown, true>,
    projectId: string,
    connectionId: string
  ): Promise<IRequisitionDAO | undefined> {
    cx.log.trace({ connectionId }, 'try to get requisition by connectionId');
    return RequisitionDAO.query(cx.trx).findOne({
      projectId: Number(projectId),
      connectionId: connectionId,
    });
  }

  async updateRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    requisitionId: string,
    changes: UpdateRequisitionRepositoryChanges
  ): Promise<IRequisitionDAO> {
    ctx.log.trace({ requisitionId, changes }, 'try to update requisition');

    // instance is used due to the insert/update PaymentDAO model triggers are used to create access period record
    const requisition = await RequisitionDAO.query(ctx.trx).findOne({
      projectId: Number(projectId),
      id: requisitionId,
    });

    if (!requisition) {
      throw new NotFoundError('Requisition not found');
    }

    const { connectionId, status, response } = changes;

    await requisition.$query(ctx.trx).patch({
      connectionId,
      status,
      responses: response ? knex.raw('array_append(responses, ?)', [response]) : undefined,
    });

    ctx.log.info({ requisitionId }, 'updated requisition');

    return (await this.getRequisition(ctx, projectId, requisitionId)) as IRequisitionDAO;
  }

  async deleteRequisition(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    requisitionId: string
  ): Promise<void> {
    ctx.log.trace({ requisitionId }, 'try to delete requisition');
    await RequisitionDAO.query(ctx.trx).deleteById([Number(projectId), requisitionId]);
    ctx.log.info({ requisitionId }, 'deleted requisition');
  }
}

export const nordigenRepository = new NordigenRepositoryImpl();
