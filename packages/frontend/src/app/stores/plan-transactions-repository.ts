import { action, computed, makeObservable, observable } from 'mobx';

import { AccountsRepository } from './accounts-repository';
import { CategoriesRepository } from './categories-repository';
import { ContractorsRepository } from './contractors-repository';
import {
  CreatePlanTransactionData,
  IPlanTransaction,
  IPlanTransactionDTO,
  IPlanTransactionsApi,
  UpdatePlanTransactionChanges,
} from '../types/plan-transaction';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { PlanTransaction } from './models/plan-transaction';
import { Tag } from './models/tag';
import { TagsRepository } from './tags-repository';
import { UnitsRepository } from './units-repository';
import { UsersRepository } from './users-repository';

export class PlanTransactionsRepository extends ManageableStore {
  static storeName = 'PlanTransactionsRepository';

  private _planTransactions: PlanTransaction[];

  loadState: LoadState;

  constructor(mainStore: MainStore, private api: IPlanTransactionsApi) {
    super(mainStore);

    this.loadState = LoadState.none();
    this._planTransactions = [];

    makeObservable<PlanTransactionsRepository, '_planTransactions'>(this, {
      _planTransactions: observable,
      loadState: observable,
      planTransactions: computed,
      clear: action,
      fetch: action,
      removePlanTransaction: action,
    });
  }

  async fetch(): Promise<void> {
    this.loadState = LoadState.pending();

    return this.api
      .get()
      .then(
        action(({ planTransactions }) => {
          this._planTransactions = this.decode(planTransactions);
        })
      )
      .then(
        action(() => {
          this.loadState = LoadState.done();
        })
      )
      .catch(
        action(err => {
          this.loadState = LoadState.error(err);
        })
      );
  }

  async refresh(): Promise<void> {
    return this.fetch();
  }

  createPlanTransaction(
    planTransaction: Partial<IPlanTransaction> | IPlanTransaction,
    data: CreatePlanTransactionData
  ): Promise<unknown> {
    return this.api.create(data).then(
      action(response => {
        const newPlanTransaction = this.decode([response.planTransaction])[0];
        if (!newPlanTransaction) {
          return;
        }

        if (planTransaction instanceof PlanTransaction) {
          // need to replace planned transaction
          const indexOf = this._planTransactions.indexOf(planTransaction);
          if (indexOf !== -1) {
            this._planTransactions[indexOf] = newPlanTransaction;
          } else {
            this._planTransactions.push(newPlanTransaction);
          }
        } else {
          // just add new transaction
          this._planTransactions.push(newPlanTransaction);
        }
      })
    );
  }

  updatePlanTransaction(planTransaction: PlanTransaction, changes: UpdatePlanTransactionChanges): Promise<unknown> {
    return this.api.update(planTransaction.planId, changes).then(
      action(response => {
        const updatedPlanTransaction = this.decode([response.planTransaction])[0];
        if (updatedPlanTransaction) {
          const indexOf = this._planTransactions.indexOf(planTransaction);
          if (indexOf !== -1) {
            this._planTransactions[indexOf] = updatedPlanTransaction;
          } else {
            this._planTransactions.push(updatedPlanTransaction);
          }
        }
      })
    );
  }

  removePlanTransaction(planTransaction: PlanTransaction): Promise<unknown> {
    planTransaction.isDeleting = true;

    return this.api.remove(planTransaction.planId).then(
      action(() => {
        this._planTransactions = this._planTransactions.filter(t => t !== planTransaction);
      })
    );
  }

  private decode(planTransactions: IPlanTransactionDTO[]): PlanTransaction[] {
    const accountsRepository = this.getStore(AccountsRepository);
    const categoriesRepository = this.getStore(CategoriesRepository);
    const contractorsRepository = this.getStore(ContractorsRepository);
    const moneysRepository = this.getStore(MoneysRepository);
    const tagsRepository = this.getStore(TagsRepository);
    const unitsRepository = this.getStore(UnitsRepository);
    const usersRepository = this.getStore(UsersRepository);

    return planTransactions.reduce<PlanTransaction[]>((acc, planTransaction) => {
      const {
        planId,
        sign,
        amount,
        moneyId,
        categoryId,
        accountId,
        contractorId,
        quantity,
        unitId,
        startDate,
        reportPeriod,
        repetitionType,
        repetitionDays,
        terminationType,
        repetitionCount,
        endDate,
        note,
        operationNote,
        operationTags: operationTagIds,
        markerColor,
        userId,
        permit,
      } = planTransaction;

      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('User is not found', { planTransaction });
        return acc;
      }

      const category = categoriesRepository.get(categoryId);
      if (!category) {
        console.warn('Category not found', { planTransaction });
        return acc;
      }

      const account = accountsRepository.get(accountId);
      if (!account) {
        console.warn('Account not found', { planTransaction });
        return acc;
      }

      const contractor = (contractorId && contractorsRepository.get(contractorId)) || null;

      const money = moneysRepository.get(moneyId);
      if (!money) {
        console.warn('Money not found', { planTransaction });
        return acc;
      }

      const unit = (unitId && unitsRepository.get(unitId)) || null;

      const operationTags = operationTagIds.reduce<Tag[]>((acc, tagId) => {
        const tag = tagsRepository.get(tagId);
        if (tag) {
          acc.push(tag);
        }
        return acc;
      }, []);

      acc.push(
        new PlanTransaction({
          planId,
          sign,
          amount,
          money,
          category,
          account,
          contractor,
          quantity,
          unit,
          startDate,
          reportPeriod,
          repetitionType,
          repetitionDays,
          terminationType,
          repetitionCount,
          endDate,
          note,
          operationNote,
          operationTags,
          markerColor,
          user,
          permit,
        })
      );

      return acc;
    }, []);
  }

  get planTransactions(): PlanTransaction[] {
    return this._planTransactions
      .slice()
      .sort(
        (a, b) =>
          new Date(b.plan.startDate).getTime() - new Date(a.plan.startDate).getTime() ||
          Number(b.planId) - Number(a.planId)
      );
  }

  clear(): void {
    this._planTransactions = [];
  }
}
