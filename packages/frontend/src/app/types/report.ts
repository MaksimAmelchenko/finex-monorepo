import { TDate } from './index';
import { Category } from '../stores/models/category';

export interface IDynamicsReportDTO {
  items: IDynamicsReportItemDTO[];
}

export type IDynamicsReportItemDTO = {
  [prop: string]: [number, number];
} & {
  idCategory: number;
  items: IDynamicsReportItemDTO[];
  total: [number, number];
};

export interface IDynamicsReport {
  nodes: DynamicsReportTableNode[];
  footer: {
    total: [number, number];
    [props: string]: [number, number];
  };
}

export type DynamicsReportTableNode = {
  [prop: string]: any;
} & {
  id: string;
  category?: Category;
  nodes?: DynamicsReportTableNode[] | null;
};

export interface IDynamicsReportParams {
  startDate: TDate;
  endDate: TDate;
  isUseReportPeriod?: boolean;
  moneyId: string;
  contractorsUsingType?: number;
  contractors?: string;
  accountsUsingType?: number;
  accounts?: string;
  categoriesUsingType?: number;
  categories?: string;
  tagsUsingType?: number;
  tags?: string;
  isUsePlan?: boolean;
}

export interface IDistributionReportDTO {
  items: IDistributionReportItemDTO[];
}

export type IDistributionReportItemDTO = {
  idCategory: number;
  sum: [number, number];
  items: IDistributionReportItemDTO[];
};

export interface IDistributionReport {
  nodes: DistributionReportTableNode[];
  footer: {
    total: [number, number];
  };
}

export type DistributionReportTableNode = {
  id: string;
  category?: Category;
  amount: [number, number];
  nodes?: DistributionReportTableNode[] | null;
};

export interface IDistributionReportParams {
  startDate: TDate;
  endDate: TDate;
  isUseReportPeriod?: boolean;
  moneyId: string;
  contractorsUsingType?: number;
  contractors?: string;
  accountsUsingType?: number;
  accounts?: string;
  categoriesUsingType?: number;
  categories?: string;
  tagsUsingType?: number;
  tags?: string;
}

export interface IReportsApi {
  getDynamicsReport: (params: IDynamicsReportParams) => Promise<IDynamicsReportDTO>;
  getDistributionReport: (params: IDistributionReportParams) => Promise<IDistributionReportDTO>;
}
