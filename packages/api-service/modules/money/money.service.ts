import { CreateMoneyServiceData, MoneyService, UpdateMoneyServiceChanges } from './types';
import { IRequestContext } from '../../types/app';
import { Money } from './models/money';
import { NotFoundError } from '../../libs/errors';
import { moneyMapper } from './money.mapper';
import { moneyRepository } from './money.repository';

class MoneyServiceIml implements MoneyService {
  async createMoney(
    ctx: IRequestContext,
    projectId: string,
    userId: string,
    data: CreateMoneyServiceData
  ): Promise<Money> {
    const moneyDAO = await moneyRepository.createMoney(ctx, projectId, userId, data);
    return moneyMapper.toDomain(moneyDAO);
  }

  async getMoney(ctx: IRequestContext, projectId: string, moneyId: string): Promise<Money> {
    const moneyDAO = await moneyRepository.getMoney(ctx, projectId, moneyId);
    if (!moneyDAO) {
      throw new NotFoundError('Money is not found');
    }

    return moneyMapper.toDomain(moneyDAO);
  }

  async getMoneys(ctx: IRequestContext, projectId: string): Promise<Money[]> {
    const moneyDAOs = await moneyRepository.getMoneys(ctx, projectId);
    return moneyDAOs.map(moneyMapper.toDomain);
  }

  async updateMoney(
    ctx: IRequestContext,
    projectId: string,
    moneyId: string,
    changes: UpdateMoneyServiceChanges
  ): Promise<Money> {
    await this.getMoney(ctx, projectId, moneyId);
    const moneyDAO = await moneyRepository.updateMoney(ctx, projectId, moneyId, changes);
    return moneyMapper.toDomain(moneyDAO);
  }

  async deleteMoney(ctx: IRequestContext, projectId: string, moneyId: string): Promise<void> {
    await this.getMoney(ctx, projectId, moneyId);
    return moneyRepository.deleteMoney(ctx, projectId, moneyId);
  }

  async sortMoneys(ctx: IRequestContext, projectId: string, moneyIds: string[]): Promise<void> {
    return moneyRepository.sortMoneys(ctx, projectId, moneyIds);
  }
}

export const moneyService = new MoneyServiceIml();
