import { CreateMoneyRepositoryData, MoneyRepository, UpdateMoneyRepositoryChanges } from './types';
import { IRequestContext } from '../../types/app';
import { MoneyDAO } from './models/money-dao';

class MoneyRepositoryImpl implements MoneyRepository {
  async createMoney(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreateMoneyRepositoryData
  ): Promise<MoneyDAO> {
    ctx.log.trace({ data }, 'try to create money');

    const money = await MoneyDAO.query(ctx.trx).insertAndFetch({
      idProject: Number(projectId),
      idUser: Number(userId),
      ...data,
    });

    ctx.log.info({ moneyId: money.idMoney }, 'created money');
    return money;
  }

  async getMoney(ctx: IRequestContext, projectId: string, moneyId: string): Promise<MoneyDAO | undefined> {
    ctx.log.trace('try to get money');
    return MoneyDAO.query(ctx.trx).findById([Number(projectId), Number(moneyId)]);
  }

  async getMoneys(ctx: IRequestContext, projectId: string): Promise<MoneyDAO[]> {
    ctx.log.trace('try to get moneys');
    return MoneyDAO.query(ctx.trx).where({
      idProject: Number(projectId),
    });
  }

  async updateMoney(
    ctx: IRequestContext,
    projectId: string,
    moneyId: string,
    changes: UpdateMoneyRepositoryChanges
  ): Promise<MoneyDAO> {
    ctx.log.trace({ projectId, moneyId, changes }, 'try to update money');

    const money = await MoneyDAO.query(ctx.trx).patchAndFetchById([Number(projectId), Number(moneyId)], changes);

    ctx.log.info({ moneyId }, 'updated money');
    return money;
  }

  async deleteMoney(ctx: IRequestContext, projectId: string, moneyId: string): Promise<void> {
    ctx.log.trace({ moneyId }, 'try to delete money');

    await MoneyDAO.query(ctx.trx).deleteById([Number(projectId), Number(moneyId)]);

    ctx.log.info({ moneyId }, 'deleted money');
  }

  async sortMoneys(ctx: IRequestContext, projectId: string, moneyIds: string[]): Promise<void> {
    ctx.log.trace({ moneyIds }, 'try to sort money');

    const knex = MoneyDAO.knex();
    let query = knex.raw(
      `
      update cf$.money m
         set sorting = array_position(:moneyIds::int[], m.id_money)
       where m.id_project = :projectId::int
    `,
      {
        projectId: Number(projectId),
        moneyIds,
      }
    );

    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    await query;

    ctx.log.info('sorted money');
  }
}

export const moneyRepository = new MoneyRepositoryImpl();
