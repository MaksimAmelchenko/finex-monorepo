import * as isEmpty from 'lodash.isempty';
import { AccessDeniedError, InternalError, InvalidParametersError, NotFoundError } from '../../libs/errors';
import { IRequestContext, Permit } from '../../types/app';

import {
  CreateExchangeServiceData,
  FindExchangesRepositoryQuery,
  FindExchangesServiceResponse,
  IExchange,
  ExchangeRepository,
  ExchangeService,
  UpdateExchangeServiceChanges,
} from './types';
import { CashFlowItemRepository, ICashFlowItemDAO } from '../cash-flow-item/types';
import { CashFlowRepository, CashFlowType } from '../cash-flow/types';
import { CategoryGateway } from '../../services/category/gateway';
import { cashFlowItemRepository } from '../cash-flow-item/cash-flow-item.repository';
import { cashFlowRepository } from '../cash-flow/cash-flow.repository';
import { exchangeMapper } from './exchange.mapper';
import { exchangeRepository } from './exchange.repository';
import { billingService } from '../billing/billing.service';

class ExchangeServiceImpl implements ExchangeService {
  private exchangeRepository: ExchangeRepository;
  private cashFlowRepository: CashFlowRepository;
  private cashFlowItemRepository: CashFlowItemRepository;

  constructor({
    exchangeRepository,
    cashFlowRepository,
    cashFlowItemRepository,
  }: {
    exchangeRepository: ExchangeRepository;
    cashFlowRepository: CashFlowRepository;
    cashFlowItemRepository: CashFlowItemRepository;
  }) {
    this.exchangeRepository = exchangeRepository;
    this.cashFlowRepository = cashFlowRepository;
    this.cashFlowItemRepository = cashFlowItemRepository;
  }

  async createExchange(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    data: CreateExchangeServiceData
  ): Promise<IExchange> {
    await billingService.validateSubscription(ctx);
    const {
      sellAmount,
      sellMoneyId,
      buyAmount,
      buyMoneyId,
      sellAccountId,
      buyAccountId,
      fee,
      feeMoneyId,
      feeAccountId,
      exchangeDate,
      reportPeriod,
      tags,
      note,
    } = data;

    if (sellMoneyId === buyMoneyId) {
      throw new InvalidParametersError('The same money for exchange are used');
    }

    if (
      (ctx.permissions.accounts[sellAccountId] & Permit.Update) !== Permit.Update ||
      (ctx.permissions.accounts[buyAccountId] & Permit.Update) !== Permit.Update ||
      (feeAccountId && (ctx.permissions.accounts[feeAccountId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const [exchangeCategoryId, exchangeFeeCategoryId] = await Promise.all([
      ExchangeServiceImpl.getExchangeCategoryId(ctx, projectId),
      ExchangeServiceImpl.getExchangeFeeCategoryId(ctx, projectId),
    ]);

    const cashFlow = await this.cashFlowRepository.createCashFlow(ctx, projectId, userId, {
      cashFlowTypeId: CashFlowType.Exchange,
      tags,
      note,
    });

    const exchangeId = String(cashFlow.id);

    await Promise.all([
      this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, exchangeId, {
        sign: -1,
        amount: sellAmount,
        moneyId: sellMoneyId,
        accountId: sellAccountId,
        categoryId: exchangeCategoryId,
        cashFlowItemDate: exchangeDate,
        reportPeriod,
      }),
      this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, exchangeId, {
        sign: 1,
        amount: buyAmount,
        moneyId: buyMoneyId,
        accountId: buyAccountId,
        categoryId: exchangeCategoryId,
        cashFlowItemDate: exchangeDate,
        reportPeriod,
      }),
    ]);

    if (fee && feeMoneyId && feeAccountId) {
      await this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, exchangeId, {
        sign: -1,
        amount: fee,
        moneyId: feeMoneyId,
        accountId: feeAccountId,
        categoryId: exchangeFeeCategoryId,
        cashFlowItemDate: exchangeDate,
        reportPeriod,
      });
    }

    return this.getExchange(ctx, projectId, userId, exchangeId);
  }

  async getExchange(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    exchangeId: string
  ): Promise<IExchange> {
    const [cashFlowDAO, cashFlowItemDAOs] = await Promise.all([
      this.cashFlowRepository.getCashFlow(ctx, projectId, exchangeId),
      this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, [exchangeId]),
    ]);

    if (!cashFlowDAO) {
      throw new NotFoundError();
    }

    const [exchangeCategoryId, exchangeFeeCategoryId] = await Promise.all([
      ExchangeServiceImpl.getExchangeCategoryId(ctx, projectId),
      ExchangeServiceImpl.getExchangeFeeCategoryId(ctx, projectId),
    ]);

    const exchange: IExchange = exchangeMapper.toDomain(
      cashFlowDAO,
      cashFlowItemDAOs,
      exchangeCategoryId,
      exchangeFeeCategoryId
    );

    const { accounts } = ctx.permissions;
    if (
      (accounts[exchange.sellAccountId] & Permit.Read) !== Permit.Read ||
      (accounts[exchange.buyAccountId] & Permit.Read) !== Permit.Read ||
      (exchange.feeAccountId && (accounts[exchange.feeAccountId] & Permit.Read) !== Permit.Read)
    ) {
      throw new NotFoundError();
    }

    return exchange;
  }

  async findExchanges(
    ctx: IRequestContext<any, true>,
    projectId: string,
    userId: string,
    query: FindExchangesRepositoryQuery
  ): Promise<FindExchangesServiceResponse> {
    const { exchanges: exchangeDAOs, metadata } = await this.exchangeRepository.findExchanges(
      ctx,
      projectId,
      userId,
      query
    );

    const exchangeIds = exchangeDAOs.map(({ id }) => String(id));
    const cashFlowItems = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, exchangeIds);

    const cashFlowItemsByCashFlowId = cashFlowItems.reduce<Record<string, ICashFlowItemDAO[]>>((acc, cashFlowItem) => {
      acc[cashFlowItem.cashflowId] = acc[cashFlowItem.cashflowId] || [];
      acc[cashFlowItem.cashflowId].push(cashFlowItem);
      return acc;
    }, {});

    const [exchangeCategoryId, exchangeFeeCategoryId] = await Promise.all([
      ExchangeServiceImpl.getExchangeCategoryId(ctx, projectId),
      ExchangeServiceImpl.getExchangeFeeCategoryId(ctx, projectId),
    ]);

    const exchanges = exchangeDAOs.map(exchangeDAO =>
      exchangeMapper.toDomain(
        exchangeDAO,
        cashFlowItemsByCashFlowId[String(exchangeDAO.id)] || [],
        exchangeCategoryId,
        exchangeFeeCategoryId
      )
    );

    return {
      metadata,
      exchanges,
    };
  }

  async updateExchange(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    exchangeId: string,
    changes: UpdateExchangeServiceChanges
  ): Promise<IExchange> {
    await billingService.validateSubscription(ctx);
    const {
      sellAmount,
      sellMoneyId,
      buyAmount,
      buyMoneyId,
      sellAccountId,
      buyAccountId,
      exchangeDate,
      reportPeriod,
      isFee,
      fee,
      feeMoneyId,
      feeAccountId,
      note,
      tags,
    } = changes;

    const { accounts } = ctx.permissions;
    if (
      (sellAccountId && (accounts[sellAccountId] & Permit.Update) !== Permit.Update) ||
      (buyAccountId && (accounts[buyAccountId] & Permit.Update) !== Permit.Update) ||
      (feeAccountId && (accounts[feeAccountId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const exchange = await this.getExchange(ctx, projectId, userId, exchangeId);

    if ((sellMoneyId ?? exchange.sellMoneyId) === (buyMoneyId ?? exchange.buyMoneyId)) {
      throw new InvalidParametersError('The same accounts for exchange are used');
    }

    if (
      (accounts[exchange.sellAccountId] & Permit.Update) !== Permit.Update ||
      (accounts[exchange.buyAccountId] & Permit.Update) !== Permit.Update ||
      (exchange.feeAccountId && (accounts[exchange.feeAccountId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const cashFlowChanges = {
      note,
      tags,
    };
    if (!isEmpty(cashFlowChanges)) {
      await this.cashFlowRepository.updateCashFlow(ctx, projectId, exchangeId, cashFlowChanges);
    }

    const [exchangeCategoryId, exchangeFeeCategoryId] = await Promise.all([
      ExchangeServiceImpl.getExchangeCategoryId(ctx, projectId),
      ExchangeServiceImpl.getExchangeFeeCategoryId(ctx, projectId),
    ]);

    const exchangeItems = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, [exchangeId]);
    let isFeeUpdated = false;
    let exchangeSellItem: ICashFlowItemDAO | undefined;

    for (const exchangeItem of exchangeItems) {
      if (String(exchangeItem.categoryId) === exchangeCategoryId && exchangeItem.sign === -1) {
        exchangeSellItem = await this.cashFlowItemRepository.updateCashFlowItem(
          ctx,
          projectId,
          String(exchangeItem.id),
          {
            amount: sellAmount,
            moneyId: sellMoneyId,
            accountId: sellAccountId,
            cashFlowItemDate: exchangeDate,
            reportPeriod,
          }
        );
      }
      if (String(exchangeItem.categoryId) === exchangeCategoryId && exchangeItem.sign === 1) {
        await this.cashFlowItemRepository.updateCashFlowItem(ctx, projectId, String(exchangeItem.id), {
          amount: buyAmount,
          moneyId: buyMoneyId,
          accountId: buyAccountId,
          cashFlowItemDate: exchangeDate,
          reportPeriod,
        });
      }
      if (String(exchangeItem.categoryId) === exchangeFeeCategoryId) {
        if (isFee === false) {
          await this.cashFlowItemRepository.deleteCashFlowItem(ctx, projectId, String(exchangeItem.id));
        } else {
          isFeeUpdated = true;
          await this.cashFlowItemRepository.updateCashFlowItem(ctx, projectId, String(exchangeItem.id), {
            amount: fee,
            moneyId: feeMoneyId,
            accountId: feeAccountId,
            cashFlowItemDate: exchangeDate,
            reportPeriod,
          });
        }
      }
    }

    if (!exchangeSellItem) {
      throw new InternalError('Exchange record is corrupted');
    }

    if (!isFeeUpdated && isFee !== false) {
      if (fee || feeMoneyId || feeAccountId) {
        if (!fee || !feeMoneyId || !feeAccountId) {
          throw new InvalidParametersError('Fields fee, feeMoneyId and feeAccountId are required');
        }
        await this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, exchangeId, {
          sign: -1,
          amount: fee,
          moneyId: feeMoneyId,
          accountId: feeAccountId,
          categoryId: exchangeFeeCategoryId,
          cashFlowItemDate: exchangeSellItem.cashflowItemDate,
          reportPeriod: exchangeSellItem.reportPeriod,
        });
      }
    }

    return this.getExchange(ctx, projectId, userId, exchangeId);
  }

  async deleteExchange(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    exchangeId: string
  ): Promise<void> {
    await billingService.validateSubscription(ctx);
    const exchange = await this.getExchange(ctx, projectId, userId, exchangeId);
    const { accounts } = ctx.permissions;

    if (
      (accounts[exchange.sellAccountId] & Permit.Update) !== Permit.Update ||
      (accounts[exchange.buyAccountId] & Permit.Update) !== Permit.Update ||
      (exchange.feeAccountId && (accounts[exchange.feeAccountId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const exchangeItems = await this.cashFlowItemRepository.getCashFlowItems(ctx, projectId, [exchangeId]);
    for await (const exchangeItem of exchangeItems) {
      await this.cashFlowItemRepository.deleteCashFlowItem(ctx, projectId, String(exchangeItem.id));
    }

    await this.cashFlowRepository.deleteCashFlow(ctx, projectId, exchangeId);
  }

  private static async getExchangeCategoryId(ctx: IRequestContext, projectId: string): Promise<string> {
    const categories = await CategoryGateway.getCategoriesByPrototype(ctx, projectId, '21');
    if (categories.length !== 1) {
      throw new InternalError('Exchange category not found', { categoryPrototype: 21 });
    }
    return String(categories[0].idCategory);
  }

  private static async getExchangeFeeCategoryId(ctx: IRequestContext, projectId: string): Promise<string> {
    const categories = await CategoryGateway.getCategoriesByPrototype(ctx, projectId, '22');
    if (categories.length !== 1) {
      throw new InternalError('Exchange category not found', { categoryPrototype: 22 });
    }
    return String(categories[0].idCategory);
  }
}

export const exchangeService = new ExchangeServiceImpl({
  exchangeRepository,
  cashFlowRepository,
  cashFlowItemRepository,
});
