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
import { CashFlowItemRepository, ICashFlowItemDAO } from '../cahsflow-item/types';
import { CashFlowRepository, CashFlowType } from '../cahsflow/types';
import { CategoryGateway } from '../../services/category/gateway';
import { cashFlowItemRepository } from '../cahsflow-item/cashflow-item.repository';
import { cashFlowRepository } from '../cahsflow/cashflow.repository';
import { exchangeMapper } from './exchange.mapper';
import { exchangeRepository } from './exchange.repository';

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
    const {
      amountSell,
      moneySellId,
      amountBuy,
      moneyBuyId,
      accountSellId,
      accountBuyId,
      fee,
      moneyFeeId,
      accountFeeId,
      exchangeDate,
      reportPeriod,
      tags,
      note,
    } = data;

    if (moneySellId === moneyBuyId) {
      throw new InvalidParametersError('The same money for exchange are used');
    }

    if (
      (ctx.permissions.accounts[accountSellId] & Permit.Update) !== Permit.Update ||
      (ctx.permissions.accounts[accountBuyId] & Permit.Update) !== Permit.Update ||
      (accountFeeId && (ctx.permissions.accounts[accountFeeId] & Permit.Update) !== Permit.Update)
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
        amount: amountSell,
        moneyId: moneySellId,
        accountId: accountSellId,
        categoryId: exchangeCategoryId,
        cashFlowItemDate: exchangeDate,
        reportPeriod,
      }),
      this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, exchangeId, {
        sign: 1,
        amount: amountBuy,
        moneyId: moneyBuyId,
        accountId: accountBuyId,
        categoryId: exchangeCategoryId,
        cashFlowItemDate: exchangeDate,
        reportPeriod,
      }),
    ]);

    if (fee && moneyFeeId && accountFeeId) {
      await this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, exchangeId, {
        sign: -1,
        amount: fee,
        moneyId: moneyFeeId,
        accountId: accountFeeId,
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
      (accounts[exchange.accountSellId] & Permit.Read) !== Permit.Read ||
      (accounts[exchange.accountBuyId] & Permit.Read) !== Permit.Read ||
      (exchange.accountFeeId && (accounts[exchange.accountFeeId] & Permit.Read) !== Permit.Read)
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
    const {
      amountSell,
      moneySellId,
      amountBuy,
      moneyBuyId,
      accountSellId,
      accountBuyId,
      exchangeDate,
      reportPeriod,
      isFee,
      fee,
      moneyFeeId,
      accountFeeId,
      note,
      tags,
    } = changes;

    const { accounts } = ctx.permissions;
    if (
      (accountSellId && (accounts[accountSellId] & Permit.Update) !== Permit.Update) ||
      (accountBuyId && (accounts[accountBuyId] & Permit.Update) !== Permit.Update) ||
      (accountFeeId && (accounts[accountFeeId] & Permit.Update) !== Permit.Update)
    ) {
      throw new AccessDeniedError();
    }

    const exchange = await this.getExchange(ctx, projectId, userId, exchangeId);

    if ((moneySellId ?? exchange.moneySellId) === (moneyBuyId ?? exchange.moneyBuyId)) {
      throw new InvalidParametersError('The same accounts for exchange are used');
    }

    if (
      (accounts[exchange.accountSellId] & Permit.Update) !== Permit.Update ||
      (accounts[exchange.accountBuyId] & Permit.Update) !== Permit.Update ||
      (exchange.accountFeeId && (accounts[exchange.accountFeeId] & Permit.Update) !== Permit.Update)
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

    for await (const exchangeItem of exchangeItems) {
      if (String(exchangeItem.categoryId) === exchangeCategoryId && exchangeItem.sign === -1) {
        exchangeSellItem = await this.cashFlowItemRepository.updateCashFlowItem(
          ctx,
          projectId,
          String(exchangeItem.id),
          {
            amount: amountSell,
            moneyId: moneySellId,
            accountId: accountSellId,
            cashFlowItemDate: exchangeDate,
            reportPeriod,
          }
        );
      }
      if (String(exchangeItem.categoryId) === exchangeCategoryId && exchangeItem.sign === 1) {
        await this.cashFlowItemRepository.updateCashFlowItem(ctx, projectId, String(exchangeItem.id), {
          amount: amountBuy,
          moneyId: moneyBuyId,
          accountId: accountBuyId,
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
            moneyId: moneyFeeId,
            accountId: accountFeeId,
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
      if (fee || moneyFeeId || accountFeeId) {
        if (!fee || !moneyFeeId || !accountFeeId) {
          throw new InvalidParametersError('Fields fee, moneyFeeId and accountFeeId are required');
        }
        await this.cashFlowItemRepository.createCashFlowItem(ctx, projectId, userId, exchangeId, {
          sign: -1,
          amount: fee,
          moneyId: moneyFeeId,
          accountId: accountFeeId,
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
    const exchange = await this.getExchange(ctx, projectId, userId, exchangeId);
    const { accounts } = ctx.permissions;

    if (
      (accounts[exchange.accountSellId] & Permit.Update) !== Permit.Update ||
      (accounts[exchange.accountBuyId] & Permit.Update) !== Permit.Update ||
      (exchange.accountFeeId && (accounts[exchange.accountFeeId] & Permit.Update) !== Permit.Update)
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
    const category = await CategoryGateway.getCategoryByPrototype(ctx, projectId, '21');
    if (!category) {
      throw new InternalError('Exchange category not found', { categoryPrototype: 21 });
    }
    return String(category.idCategory);
  }

  private static async getExchangeFeeCategoryId(ctx: IRequestContext, projectId: string): Promise<string> {
    const category = await CategoryGateway.getCategoryByPrototype(ctx, projectId, '22');
    if (!category) {
      throw new InternalError('Exchange category not found', { categoryPrototype: 22 });
    }
    return String(category.idCategory);
  }
}

export const exchangeService = new ExchangeServiceImpl({
  exchangeRepository,
  cashFlowRepository,
  cashFlowItemRepository,
});
