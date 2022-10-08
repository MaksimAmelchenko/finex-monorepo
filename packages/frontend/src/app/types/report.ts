import { TDate } from './index';
import { Category } from '../stores/models/category';

export interface IDynamicsReportDTO {
  items: IItemDTO[];
}

export type IItemDTO = {
  [prop: string]: [number, number];
} & {
  idCategory: number;
  items: IItemDTO[];
  total: [number, number];
};

export interface IDynamicsReport {
  nodes: TableNode[];
  footer: {
    total: [number, number];
    [props: string]: [number, number];
  };
}

export type TableNode = {
  [prop: string]: any;
} & {
  id: string;
  category?: Category;
  nodes?: TableNode[] | null;
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

export interface IReportsApi {
  getDynamicsReport: (params: IDynamicsReportParams) => Promise<IDynamicsReportDTO>;
}
