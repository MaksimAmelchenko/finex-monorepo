import { action, makeObservable, observable, reaction } from 'mobx';
import { format, sub } from 'date-fns';

import { ApiError } from '../core/errors';
import { CategoriesRepository } from './categories-repository';
import {
  IDynamicsReport,
  IDynamicsReportDTO,
  IDynamicsReportParams,
  IItemDTO,
  IReportsApi,
  TableNode,
} from '../types/report';
import { LoadState } from '../core/load-state';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { Money } from './models/money';
import { SnackbarUtils } from '../components/SnackbarUtilsConfigurator/SnackbarUtilsConfigurator';
import { getT } from '../lib/core/i18n';

export enum UsingType {
  Include = '1',
  Exclude = '2',
}
interface IFilter {
  range: [Date, Date];
  money: Money | null;
  contractorsUsingType: string;
  contractors: string[];
  accountsUsingType: string;
  accounts: string[];
  categoriesUsingType: string;
  categories: string[];
  tagsUsingType: string;
  tags: string[];
  more: Array<'isUseReportPeriod' | 'isUsePlanningOperation'>;
}

const t = getT('ReportsRepository');

export class ReportsRepository extends ManageableStore {
  static storeName = 'ReportsRepository';

  dynamicsReport: IDynamicsReport | null = null;
  dynamicsReportLoadState: LoadState = LoadState.none();
  filter: IFilter = {
    range: [sub(new Date(), { months: 6 }), new Date()],
    money: null,
    contractorsUsingType: UsingType.Include,
    contractors: [],
    accountsUsingType: UsingType.Include,
    accounts: [],
    categoriesUsingType: UsingType.Include,
    categories: [],
    tagsUsingType: UsingType.Include,
    tags: [],
    more: ['isUseReportPeriod', 'isUsePlanningOperation'],
  };

  constructor(mainStore: MainStore, private api: IReportsApi) {
    super(mainStore);

    this.dynamicsReportLoadState = LoadState.none();

    makeObservable(this, {
      dynamicsReport: observable.shallow,
      filter: observable,
      dynamicsReportLoadState: observable,
      clear: action,
      getDynamicsReport: action,
      setFilter: action,
    });

    reaction(
      () => this.filter,
      () => {
        this.getDynamicsReport().catch((err: ApiError) => {
          // let message = err.message;
          const message = t('Something went wrong, please try again later');
          // switch (err.code) {
          //   case 'invalidParameters': {
          //   }
          // }
          SnackbarUtils.error(message);
        });
      }
    );
  }

  async getDynamicsReport(): Promise<void> {
    this.dynamicsReportLoadState = LoadState.pending();

    const {
      range: [startDate, endDate],
      money,
      contractorsUsingType,
      contractors,
      accountsUsingType,
      accounts,
      categoriesUsingType,
      categories,
      tagsUsingType,
      tags,
      more,
    } = this.filter;
    if (!money) {
      throw new Error('Money is not defined');
    }

    const params: IDynamicsReportParams = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      isUseReportPeriod: more.includes('isUsePlanningOperation'),
      moneyId: money.id,
      contractorsUsingType: Number(contractorsUsingType),
      contractors: contractors.join(','),
      accountsUsingType: Number(accountsUsingType),
      accounts: accounts.join(','),
      categoriesUsingType: Number(categoriesUsingType),
      categories: categories.join(','),
      tagsUsingType: Number(tagsUsingType),
      tags: tags.join(','),
      isUsePlan: more.includes('isUsePlanningOperation'),
    };

    return this.api
      .getDynamicsReport(params)
      .then(
        action(response => {
          this.dynamicsReport = this.decode(response);
        })
      )
      .then(
        action(() => {
          this.dynamicsReportLoadState = LoadState.done();
        })
      );
  }

  setFilter(filter: Partial<IFilter>) {
    this.filter = {
      ...this.filter,
      ...filter,
    };
  }

  private decode({ items }: IDynamicsReportDTO): IDynamicsReport {
    const nodes = this.decodeItems(items);
    // calculate total by months
    const footer = nodes.reduce<{ total: [number, number]; [props: string]: [number, number] }>(
      (acc, { id, category, ...rest }) => {
        Object.keys(rest).forEach(key => {
          //  "202201": [10, 200] ?
          if (key.match(/^\d{6}$/) && Array.isArray(rest[key]) && rest[key].length === 2) {
            acc[key] = acc[key] || [0, 0];
            const [a, b] = rest[key];
            acc[key] = [acc[key][0] + a, acc[key][1] + b];
            acc.total = [acc.total[0] + a, acc.total[1] + b];
          }
        });

        return acc;
      },
      { total: [0, 0] }
    );

    return {
      nodes,
      footer,
    };
  }
  i = 0;
  private decodeItems(items: IItemDTO[]): TableNode[] {
    return items.map(({ idCategory, items, ...rest }) => {
      const category = this.getStore(CategoriesRepository).get(String(idCategory));
      const total = Object.keys(rest).reduce<[number, number]>(
        (acc, key) => {
          if (key.match(/^\d{6}$/) && Array.isArray(rest[key]) && rest[key].length === 2) {
            const [a, b] = rest[key];
            acc = [acc[0] + a, acc[1] + b];
          }
          return acc;
        },
        [0, 0]
      );

      return {
        id: String(this.i++),
        category,
        ...rest,
        total,
        nodes: items && Array.isArray(items) && items.length ? this.decodeItems(items) : null,
      };
    });
  }

  clear(): void {
    this.dynamicsReport = null;
  }
}
