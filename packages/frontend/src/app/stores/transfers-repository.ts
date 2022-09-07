import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { format, parseISO } from 'date-fns';

import { Account } from './models/account';
import { AccountsRepository } from './accounts-repository';
import { CreateTransferData, ITransferDTO, ITransfersApi, UpdateTransferChanges } from '../types/transfer';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { Money } from './models/money';
import { MoneysRepository } from './moneys-repository';
import { Tag } from './models/tag';
import { TagsRepository } from './tags-repository';
import { Transfer } from './models/transfer';
import { UsersRepository } from './users-repository';

interface IFilter {
  isFilter: boolean;
  range: [Date | null, Date | null];
  searchText: string;
  accountsFrom: string[];
  accountsTo: string[];
  tags: string[];
}

export class TransfersRepository extends ManageableStore {
  static storeName = 'TransfersRepository';
  limit: number;
  offset: number;
  total: number;

  filter: IFilter = {
    range: [null, null],
    isFilter: false,
    searchText: '',
    accountsFrom: [],
    accountsTo: [],
    tags: [],
  };

  private _transfers: Transfer[];

  loadState: LoadState;

  constructor(mainStore: MainStore, private api: ITransfersApi) {
    super(mainStore);
    this.limit = 50;
    this.offset = 0;
    this.total = 0;

    this.loadState = LoadState.none();
    this._transfers = [];

    makeObservable<TransfersRepository, '_transfers'>(this, {
      _transfers: observable,
      loadState: observable,
      filter: observable,
      transfers: computed,
      clear: action,
      fetch: action,
      setFilter: action,
      removeTransfer: action,
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
      accountsFrom,
      accountsTo,
      tags,
    } = this.filter;
    let params = {};
    if (isFilter) {
      params = {
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        accountsFrom: accountsFrom.join(','),
        accountsTo: accountsTo.join(','),
        tags: tags.join(','),
      };
    }

    return this.api
      .getTransfers({
        offset: this.offset,
        limit: this.limit,
        searchText,
        ...params,
      })
      .then(
        action(({ transfers, metadata }) => {
          this.limit = metadata.limit;
          this.offset = metadata.offset;
          this.total = metadata.total;
          this._transfers = this.decode(transfers);
        })
      )
      .then(
        action(() => {
          this.loadState = LoadState.done();
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
    return this.fetch();
  }

  setFilter(filter: Partial<IFilter>) {
    this.filter = {
      ...this.filter,
      ...filter,
    };
  }

  getTransfer(transferId: string): Transfer | undefined {
    return this._transfers.find(({ id }) => id === transferId);
  }

  createTransfer(data: CreateTransferData): Promise<Transfer> {
    return this.api.createTransfer(data).then(
      action(response => {
        const newTransfer = this.decode([response.transfer])[0];
        if (!newTransfer) {
          throw new Error('Transfer create is failed');
        }

        this._transfers.push(newTransfer);
        return newTransfer;
      })
    );
  }

  updateTransfer(transfer: Transfer, changes: UpdateTransferChanges): Promise<Transfer> {
    return this.api.updateTransfer(transfer.id, changes).then(
      action(response => {
        const updatedTransfer = this.decode([response.transfer])[0];
        if (updatedTransfer) {
          const indexOf = this._transfers.indexOf(transfer);
          if (indexOf !== -1) {
            this._transfers[indexOf] = updatedTransfer;
          } else {
            this._transfers.push(updatedTransfer);
          }
        } else {
          throw new Error('Transfer update is failed');
        }
        return updatedTransfer;
      })
    );
  }

  removeTransfer(transfer: Transfer): Promise<unknown> {
    transfer.isDeleting = true;

    return this.api.deleteTransfer(transfer.id).then(
      action(() => {
        this._transfers = this._transfers.filter(t => t !== transfer);
      })
    );
  }

  private decode(transfers: ITransferDTO[]): Transfer[] {
    const moneysRepository = this.getStore(MoneysRepository);
    const accountsRepository = this.getStore(AccountsRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const usersRepository = this.getStore(UsersRepository);

    return transfers.reduce<Transfer[]>((acc, transfer) => {
      const {
        userId,
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
        updatedAt,
      } = transfer;

      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('User is not found', { transfer });
        return acc;
      }

      const money = moneysRepository.get(moneyId);
      if (!money) {
        console.warn('Money is not found', { transfer });
        return acc;
      }

      const accountFrom = accountsRepository.get(accountFromId);
      if (!accountFrom) {
        console.warn('Contractor is not found', { transfer });
        return acc;
      }

      const accountTo = accountsRepository.get(accountToId);
      if (!accountTo) {
        console.warn('Contractor is not found', { transfer });
        return acc;
      }

      let moneyFee: Money | null = null;
      if (moneyFeeId) {
        moneyFee = moneysRepository.get(moneyFeeId) || null;
        if (!moneyFee) {
          console.warn('MoneyFee is not found', { transfer });
          return acc;
        }
      }

      let accountFee: Account | null = null;
      if (accountFeeId) {
        accountFee = accountsRepository.get(accountFeeId) || null;
        if (!accountFee) {
          console.warn('AccountFee is not found', { transfer });
          return acc;
        }
      }

      const tags = tagIds.reduce<Tag[]>((acc, tagId) => {
        const tag = tagsRepository.get(tagId);
        if (tag) {
          acc.push(tag);
        }
        return acc;
      }, []);

      acc.push(
        new Transfer({
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
          note,
          tags,
          user,
          updatedAt,
        })
      );

      return acc;
    }, []);
  }

  get transfers(): Transfer[] {
    return this._transfers
      .slice()
      .sort(
        (a, b) => parseISO(b.transferDate).getTime() - parseISO(a.transferDate).getTime() || Number(b.id) - Number(a.id)
      );
  }

  clear(): void {
    this._transfers = [];
  }
}
