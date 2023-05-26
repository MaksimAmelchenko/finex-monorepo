import { action, makeObservable, observable, reaction } from 'mobx';
import { format, sub } from 'date-fns';

import { ApiError } from '../core/errors';
import { CategoriesRepository } from './categories-repository';
import {
  DistributionReportTableNode,
  DynamicsReportTableNode,
  IDistributionReport,
  IDistributionReportDTO,
  IDistributionReportItemDTO,
  IDistributionReportParams,
  IDynamicsReport,
  IDynamicsReportDTO,
  IDynamicsReportItemDTO,
  IDynamicsReportParams,
  IReportsApi,
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

interface IDynamicsReportFilter {
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

interface IDistributionReportFilter {
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
  more: Array<'isUseReportPeriod'>;
}

const t = getT('ReportsRepository');

export class ReportsRepository extends ManageableStore {
  static storeName = 'ReportsRepository';
  i = 0;
  dynamicsReport: IDynamicsReport | null = null;
  dynamicsReportLoadState: LoadState = LoadState.none();
  dynamicsReportFilter: IDynamicsReportFilter = {
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

  distributionReport: IDistributionReport | null = null;
  distributionReportLoadState: LoadState = LoadState.none();
  distributionReportFilter: IDistributionReportFilter = {
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
    more: ['isUseReportPeriod'],
  };

  constructor(mainStore: MainStore, private api: IReportsApi) {
    super(mainStore);

    this.dynamicsReportLoadState = LoadState.none();

    makeObservable(this, {
      dynamicsReport: observable.shallow,
      dynamicsReportFilter: observable,
      dynamicsReportLoadState: observable,
      distributionReport: observable.shallow,
      distributionReportFilter: observable,
      distributionReportLoadState: observable,
      clear: action,
      getDynamicsReport: action,
      setDynamicsReportFilter: action,
      getDistributionReport: action,
      setDistributionReportFilter: action,
    });

    reaction(
      () => this.dynamicsReportFilter,
      () => {
        this.getDynamicsReport().catch((err: ApiError) => {
          const message = t('Something went wrong, please try again later');
          SnackbarUtils.error(message);
        });
      }
    );

    reaction(
      () => this.distributionReportFilter,
      () => {
        this.getDistributionReport().catch((err: ApiError) => {
          const message = t('Something went wrong, please try again later');
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
    } = this.dynamicsReportFilter;
    if (!money) {
      throw new Error('Money is not defined');
    }

    const params: IDynamicsReportParams = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      isUseReportPeriod: more.includes('isUseReportPeriod'),
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

  setDynamicsReportFilter(filter: Partial<IDynamicsReportFilter>) {
    this.dynamicsReportFilter = {
      ...this.dynamicsReportFilter,
      ...filter,
    };
  }
  async getDistributionReport(): Promise<void> {
    this.distributionReportLoadState = LoadState.pending();

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
    } = this.distributionReportFilter;
    if (!money) {
      throw new Error('Money is not defined');
    }

    const params: IDistributionReportParams = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      isUseReportPeriod: more.includes('isUseReportPeriod'),
      moneyId: money.id,
      contractorsUsingType: Number(contractorsUsingType),
      contractors: contractors.join(','),
      accountsUsingType: Number(accountsUsingType),
      accounts: accounts.join(','),
      categoriesUsingType: Number(categoriesUsingType),
      categories: categories.join(','),
      tagsUsingType: Number(tagsUsingType),
      tags: tags.join(','),
    };

    return this.api
      .getDistributionReport(params)
      .then(
        action(response => {
          this.distributionReport = this.decodeDistributionReport(response);
        })
      )
      .then(
        action(() => {
          this.distributionReportLoadState = LoadState.done();
        })
      );
  }

  setDistributionReportFilter(filter: Partial<IDistributionReportFilter>) {
    this.distributionReportFilter = {
      ...this.distributionReportFilter,
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

  private decodeItems(items: IDynamicsReportItemDTO[]): DynamicsReportTableNode[] {
    return items.map(({ idCategory, items, ...rest }) => {
      const category =
        idCategory === 0
          ? {
              id: '0',
              name: t('Uncategorized'),
            }
          : this.getStore(CategoriesRepository).get(String(idCategory));
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

  private decodeDistributionReport({ items }: IDistributionReportDTO): IDistributionReport {
    const nodes = this.decodeDistributionReportItems(items);
    const total = nodes.reduce<[number, number]>((acc, { amount }) => [acc[0] + amount[0], acc[1] + amount[1]], [0, 0]);

    return {
      nodes,
      footer: {
        total,
      },
    };
  }

  private decodeDistributionReportItems(items: IDistributionReportItemDTO[]): DistributionReportTableNode[] {
    return items.map(({ idCategory, items, sum }) => {
      const category =
        idCategory === 0
          ? {
              id: '0',
              name: t('Uncategorized'),
            }
          : this.getStore(CategoriesRepository).get(String(idCategory));

      return {
        id: String(this.i++),
        category,
        amount: sum,
        nodes: items && Array.isArray(items) && items.length ? this.decodeDistributionReportItems(items) : null,
      };
    });
  }

  clear(): void {
    this.dynamicsReport = null;
    this.i = 0;
  }
}
