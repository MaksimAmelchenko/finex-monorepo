import { action, makeObservable, observable, reaction, computed, runInAction } from 'mobx';
import { format, parseISO } from 'date-fns';

import { AccountsRepository } from './accounts-repository';
import { CategoriesRepository } from './categories-repository';
import { ContractorsRepository } from './contractors-repository';
import { CreateTransactionData, UpdateTransactionChanges } from '../types/transaction';
import { CreateTransferData, UpdateTransferChanges } from '../types/transfer';
import {
  GetOperationsQuery,
  IOperation,
  IOperationDebtDTO,
  IOperationDTO,
  IOperationExchangeDTO,
  IOperationsApi,
  IOperationTransaction,
  IOperationTransactionDTO,
  IOperationTransferDTO,
} from '../types/operation';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { OperationDebt, OperationExchange, OperationTransaction, OperationTransfer } from './models/operation';
import { PlannedTransaction } from './models/planned-transaction';
import { PlansRepository } from './plans-repository';
import { TDate } from '../types';
import { Tag } from './models/tag';
import { TagsRepository } from './tags-repository';
import { UnitsRepository } from './units-repository';
import { UsersRepository } from './users-repository';

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

  private _operations: IOperation[];

  loadState: LoadState;

  constructor(mainStore: MainStore, private api: IOperationsApi) {
    super(mainStore);
    this.limit = 50;
    this.offset = 0;
    this.total = 0;

    this.loadState = LoadState.none();
    this._operations = [];

    makeObservable<OperationsRepository, '_operations'>(this, {
      _operations: observable,
      filter: observable,
      loadState: observable,
      operations: computed,
      operationsByDates: computed,
      clear: action,
      fetch: action,
      refresh: action,
      setFilter: action,
    });

    reaction(
      () => this.filter,
      () => {
        this.refresh();
      }
    );
  }

  get operations(): IOperation[] {
    return this._operations
      .slice()
      .sort(
        (a, b) =>
          Number(Boolean((b as any).planId)) - Number(Boolean((a as any).planId)) ||
          parseISO(b.operationDate).getTime() - parseISO(a.operationDate).getTime() ||
          Number((b as any).id) - Number((a as any).id)
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
          this._operations = [...this._operations, ...operations];
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
    this._operations = [];
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
    return this._operations.find(({ id }) => id === operationId);
  }

  createTransaction(transaction: Partial<IOperationTransaction>, data: CreateTransactionData): Promise<unknown> {
    return this.api.createTransaction(data).then(
      action(response => {
        const newTransaction = this.decodeTransaction(response.transaction);
        if (!newTransaction) {
          throw new Error('Transaction entity is corrupted');
        }

        if (transaction instanceof PlannedTransaction) {
          /*
          // need to replace planned transaction
          const indexOf = this._transactions.indexOf(transaction);
          if (indexOf !== -1) {
            this._transactions[indexOf] = newTransaction;
          } else {
            this._transactions.push(newTransaction);
          }
          */
        } else {
          // just add new transaction
          this._operations.push(newTransaction);
        }
      })
    );
  }

  updateTransaction(transaction: OperationTransaction, changes: UpdateTransactionChanges): Promise<unknown> {
    return this.api.updateTransaction(transaction.id, changes).then(
      action(response => {
        const updatedTransaction = this.decodeTransaction(response.transaction);
        if (!updatedTransaction) {
          throw new Error('Transaction entity is corrupted');
        }
          const indexOf = this._operations.indexOf(transaction);
          if (indexOf !== -1) {
            this._operations[indexOf] = updatedTransaction;
          } else {
            this._operations.push(updatedTransaction);
          }
      })
    );
  }

  deleteTransaction(transaction: OperationTransaction | PlannedTransaction): Promise<unknown> {
    runInAction(() => {
    transaction.isDeleting = true;
    });
    let operation: Promise<void>;
    if (transaction instanceof PlannedTransaction) {
      operation = this._mainStore
        .get(PlansRepository)
        .cancelPlan(transaction.planId, { excludedDate: transaction.transactionDate });
    } else {
      operation = this.api.deleteTransaction(transaction.id);
    }

    return operation.then(
      action(() => {
        this._operations = this._operations.filter(operation => operation !== transaction);
      })
    );
  }

  createTransfer(data: CreateTransferData): Promise<unknown> {
    return this.api.createTransfer(data).then(
      action(response => {
        const transfer = this.decodeTransfer(response.transfer);
        if (!transfer) {
          throw new Error('Transfer entity is corrupted');
        }

        this._operations.push(transfer);
      })
    );
  }

  updateTransfer(transfer: OperationTransfer, changes: UpdateTransferChanges): Promise<unknown> {
    return this.api.updateTransfer(transfer.id, changes).then(
      action(response => {
        const updatedTransfer = this.decodeTransfer(response.transfer);
        if (!updatedTransfer) {
          throw new Error('Exchange entity is corrupted');
        }
          const indexOf = this._operations.indexOf(transfer);
          if (indexOf !== -1) {
            this._operations[indexOf] = updatedTransfer;
          } else {
            this._operations.push(updatedTransfer);
          }
      })
    );
  }

  deleteTransfer(transfer: OperationTransfer): Promise<unknown> {
    runInAction(() => {
    transfer.isDeleting = true;
    });
    return this.api.deleteTransfer(transfer.id).then(
      action(() => {
        this._operations = this._operations.filter(operation => operation !== transfer);
      })
    );
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

  private decodeTransaction(transaction: Omit<IOperationTransactionDTO, 'operationType'>): OperationTransaction | null {
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

  private decodeDebt(debt: Omit<IOperationDebtDTO, 'operationType'>): OperationDebt | null {
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

  private decodeTransfer(transfer: Omit<IOperationTransferDTO, 'operationType'>): OperationTransfer | null {
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
      updatedAt,
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
      updatedAt,
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
    this._operations = [];
  }
}
