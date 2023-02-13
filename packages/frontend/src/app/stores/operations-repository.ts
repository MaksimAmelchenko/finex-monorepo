import { action, makeObservable, observable, reaction, computed } from 'mobx';
import { format } from 'date-fns';

import { AccountsRepository } from './accounts-repository';
import { CategoriesRepository } from './categories-repository';
import { ContractorsRepository } from './contractors-repository';
import {
  GetOperationsQuery,
  IOperation,
  IOperationDebtDTO,
  IOperationDTO,
  IOperationExchangeDTO,
  IOperationsApi,
  IOperationTransactionDTO,
  IOperationTransferDTO,
} from '../types/operation';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { OperationDebt, OperationExchange, OperationTransaction, OperationTransfer } from './models/operation';
import { Tag } from './models/tag';
import { TagsRepository } from './tags-repository';
import { UnitsRepository } from './units-repository';
import { UsersRepository } from './users-repository';
import { TDate } from '../types';

interface IFilter {
  isFilter: boolean;
  range: [Date | null, Date | null];
  searchText: string;
  accounts: string[];
  categories: string[];
  contractors: string[];
  tags: string[];
}

interface IOperationsByDate {
  date: TDate;
  operations: IOperation[];
}

export class OperationsRepository extends ManageableStore {
  static storeName = 'OperationsRepository';
  limit: number;
  offset: number;
  total: number;

  filter: IFilter = {
    range: [null, null],
    isFilter: false,
    searchText: '',
    accounts: [],
    categories: [],
    contractors: [],
    tags: [],
  };

  operations: IOperation[];
  private operationsMap: Map<string, IOperation>;

  loadState: LoadState;

  constructor(mainStore: MainStore, private api: IOperationsApi) {
    super(mainStore);
    this.limit = 50;
    this.offset = 0;
    this.total = 0;

    this.loadState = LoadState.none();
    this.operations = [];
    this.operationsMap = new Map<string, IOperation>();

    makeObservable(this, {
      operations: observable,
      loadState: observable,
      filter: observable,
      clear: action,
      fetch: action,
      setFilter: action,
      refresh: action,
      operationsByDates: computed,
    });

    reaction(
      () => this.filter,
      () => {
        this.refresh();
      }
    );
  }

  async fetch(): Promise<void> {
    this.loadState = LoadState.pending();
    const {
      isFilter,
      range: [startDate, endDate],
      searchText,
      accounts,
      categories,
      contractors,
      tags,
    } = this.filter;

    let params: GetOperationsQuery = {
      limit: this.limit,
      offset: this.offset,
    };

    if (isFilter) {
      params = {
        ...params,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        accounts: accounts.join(','),
        categories: categories.join(','),
        contractors: contractors.join(','),
        tags: tags.join(','),
      };
    }

    return this.api
      .get({
        searchText,
        ...params,
      })
      .then(
        action(({ operations: operationDTOs, metadata }) => {
          this.limit = metadata.limit;
          this.offset = metadata.offset;
          this.total = metadata.total;
          const operations = this.decode(operationDTOs);
          operations.forEach(operation => this.operationsMap.set(operation.id, operation));
          this.operations = [...this.operations, ...operations];
        })
      )
      .then(
        action(() => {
          this.loadState = LoadState.done();
        })
      )
      .catch(
        action((err: any) => {
          this.loadState = LoadState.error(err);
        })
      );
  }

  async fetchNextPage(): Promise<void> {
    this.offset = this.offset + this.limit;
    return this.fetch();
  }

  async fetchPreviousPage(): Promise<void> {
    this.offset = Math.max(this.offset - this.limit, 0);
    return this.fetch();
  }

  async refresh(): Promise<void> {
    this.offset = 0;
    this.operations = [];
    return this.fetch();
  }

  setFilter(filter: Partial<IFilter>) {
    this.filter = {
      ...this.filter,
      ...filter,
    };
  }

  get operationsByDates(): IOperationsByDate[] {
    const map: Map<string, IOperation[]> = new Map();
    this.operations.forEach(operation => {
      let item = map.get(operation.operationDate);
      if (!item) {
        map.set(operation.operationDate, [operation]);
      } else {
        item.push(operation);
      }
    });

    return Array.from(map, ([date, operations]) => ({ date, operations }));
  }

  getOperation(operationId: string): IOperation | undefined {
    return this.operationsMap.get(operationId);
  }

  private decode(operationDTOs: IOperationDTO[]): IOperation[] {
    const handlerMap: Record<string, (operation: any) => IOperation | null> = {
      transaction: this.decodeTransaction.bind(this),
      debt: this.decodeDebt.bind(this),
      transfer: this.decodeTransfer.bind(this),
      exchange: this.decodeExchange.bind(this),
    };

    return operationDTOs.reduce<IOperation[]>((acc, operationDTO) => {
      const handler = handlerMap[operationDTO.operationType];
      const operation = (handler && handler(operationDTO)) || null;

      if (operation) {
        acc.push(operation);
      }
      return acc;
    }, []);
  }

  private decodeTransaction(transaction: IOperationTransactionDTO): OperationTransaction | null {
    const accountsRepository = this.getStore(AccountsRepository);
    const categoriesRepository = this.getStore(CategoriesRepository);
    const contractorsRepository = this.getStore(ContractorsRepository);
    const moneysRepository = this.getStore(MoneysRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const unitsRepository = this.getStore(UnitsRepository);
    const usersRepository = this.getStore(UsersRepository);

    const {
      id,
      cashFlowId,
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      contractorId,
      transactionDate,
      reportPeriod,
      quantity,
      unitId,
      isNotConfirmed,
      note,
      tags: tagIds,
      permit,
      userId,
    } = transaction;

    const user = usersRepository.get(userId);
    if (!user) {
      console.warn('User is not found', { transaction });
      return null;
    }

    const category = categoriesRepository.get(categoryId);
    if (!category) {
      console.warn('Category not found', { transaction });
      return null;
    }

    const account = accountsRepository.get(accountId);
    if (!account) {
      console.warn('Account not found', { transaction });
      return null;
    }

    const contractor = (contractorId && contractorsRepository.get(contractorId)) || null;

    const money = moneysRepository.get(moneyId);
    if (!money) {
      console.warn('Money not found', { transaction });
      return null;
    }

    const unit = (unitId && unitsRepository.get(unitId)) || null;

    const tags = tagIds.reduce<Tag[]>((acc, tagId) => {
      const tag = tagsRepository.get(tagId);
      if (tag) {
        acc.push(tag);
      }
      return acc;
    }, []);

    return new OperationTransaction({
      id,
      cashFlowId,
      sign,
      amount,
      money,
      category,
      account,
      contractor,
      transactionDate,
      reportPeriod,
      unit,
      quantity,
      isNotConfirmed,
      note: note ?? '',
      tags,
      permit,
      user,
    });
  }

  private decodeDebt(debt: IOperationDebtDTO): OperationDebt | null {
    const accountsRepository = this.getStore(AccountsRepository);
    const categoriesRepository = this.getStore(CategoriesRepository);
    const contractorsRepository = this.getStore(ContractorsRepository);
    const moneysRepository = this.getStore(MoneysRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const usersRepository = this.getStore(UsersRepository);

    const {
      id,
      cashFlowId,
      sign,
      amount,
      moneyId,
      categoryId,
      accountId,
      contractorId,
      debtItemDate,
      reportPeriod,
      note,
      tags: tagIds,
      permit,
      userId,
    } = debt;

    const user = usersRepository.get(userId);
    if (!user) {
      console.warn('User is not found', { debt });
      return null;
    }

    const category = categoriesRepository.get(categoryId);
    if (!category) {
      console.warn('Category not found', { debt });
      return null;
    }

    const account = accountsRepository.get(accountId);
    if (!account) {
      console.warn('Account not found', { debt });
      return null;
    }

    const contractor = contractorsRepository.get(contractorId);
    if (!contractor) {
      console.warn('Contractor not found', { debt });
      return null;
    }

    const money = moneysRepository.get(moneyId);
    if (!money) {
      console.warn('Money not found', { debt });
      return null;
    }

    const tags = tagIds.reduce<Tag[]>((acc, tagId) => {
      const tag = tagsRepository.get(tagId);
      if (tag) {
        acc.push(tag);
      }
      return acc;
    }, []);

    return new OperationDebt({
      id,
      cashFlowId,
      sign,
      amount,
      money,
      category,
      account,
      contractor,
      debtItemDate,
      reportPeriod,
      note: note ?? '',
      tags,
      permit,
      user,
    });
  }

  private decodeTransfer(transfer: IOperationTransferDTO): OperationTransfer | null {
    const accountsRepository = this.getStore(AccountsRepository);
    const moneysRepository = this.getStore(MoneysRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const usersRepository = this.getStore(UsersRepository);

    const {
      id,
      amount,
      moneyId,
      accountFromId,
      accountToId,
      transferDate,
      reportPeriod,
      fee,
      moneyFeeId,
      accountFeeId,
      note,
      tags: tagIds,
      userId,
    } = transfer;

    const user = usersRepository.get(userId);
    if (!user) {
      console.warn('User is not found', { transfer });
      return null;
    }

    const accountFrom = accountsRepository.get(accountFromId);
    if (!accountFrom) {
      console.warn('Account not found', { transfer });
      return null;
    }

    const accountTo = accountsRepository.get(accountToId);
    if (!accountTo) {
      console.warn('Account not found', { transfer });
      return null;
    }

    const money = moneysRepository.get(moneyId);
    if (!money) {
      console.warn('Money not found', { transfer });
      return null;
    }

    const moneyFee = (moneyFeeId && moneysRepository.get(moneyFeeId)) || null;
    const accountFee = (accountFeeId && accountsRepository.get(accountFeeId)) || null;

    const tags = tagIds.reduce<Tag[]>((acc, tagId) => {
      const tag = tagsRepository.get(tagId);
      if (tag) {
        acc.push(tag);
      }
      return acc;
    }, []);

    return new OperationTransfer({
      id,
      amount,
      money,
      accountFrom,
      accountTo,
      transferDate,
      reportPeriod,
      fee,
      moneyFee,
      accountFee,
      note: note ?? '',
      tags,
      user,
    });
  }

  private decodeExchange(exchange: IOperationExchangeDTO): OperationExchange | null {
    const accountsRepository = this.getStore(AccountsRepository);
    const moneysRepository = this.getStore(MoneysRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const usersRepository = this.getStore(UsersRepository);

    const {
      id,
      sellAmount,
      moneySellId,
      accountSellId,
      buyAmount,
      moneyBuyId,
      accountBuyId,
      exchangeDate,
      reportPeriod,
      fee,
      moneyFeeId,
      accountFeeId,
      note,
      tags: tagIds,
      userId,
    } = exchange;

    const user = usersRepository.get(userId);
    if (!user) {
      console.warn('User is not found', { exchange });
      return null;
    }

    const moneySell = moneysRepository.get(moneySellId);
    if (!moneySell) {
      console.warn('Money not found', { exchange });
      return null;
    }

    const accountSell = accountsRepository.get(accountSellId);
    if (!accountSell) {
      console.warn('Account not found', { exchange });
      return null;
    }

    const moneyBuy = moneysRepository.get(moneyBuyId);
    if (!moneyBuy) {
      console.warn('Money not found', { exchange });
      return null;
    }

    const accountBuy = accountsRepository.get(accountBuyId);
    if (!accountBuy) {
      console.warn('Account not found', { exchange });
      return null;
    }

    const moneyFee = (moneyFeeId && moneysRepository.get(moneyFeeId)) || null;
    const accountFee = (accountFeeId && accountsRepository.get(accountFeeId)) || null;

    const tags = tagIds.reduce<Tag[]>((acc, tagId) => {
      const tag = tagsRepository.get(tagId);
      if (tag) {
        acc.push(tag);
      }
      return acc;
    }, []);

    return new OperationExchange({
      id,
      sellAmount,
      moneySell,
      accountSell,
      buyAmount,
      moneyBuy,
      accountBuy,
      exchangeDate,
      reportPeriod,
      fee,
      moneyFee,
      accountFee,
      note: note ?? '',
      tags,
      user,
    });
  }

  clear(): void {
    this.operations = [];
  }
}
