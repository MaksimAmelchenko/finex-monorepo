import { stringify } from 'query-string';

import { ApiRepository } from '../../core/other-stores/api-repository';
import { IDynamicsReportDTO, IDynamicsReportParams, IReportsApi } from '../../types/report';

export class ReportsApi extends ApiRepository implements IReportsApi {
  static override storeName = 'ReportsApi';

  async getDynamicsReport(params: IDynamicsReportParams): Promise<IDynamicsReportDTO> {
    const queryString = stringify(params, { skipNull: true, skipEmptyString: true });
    return this.fetch<IDynamicsReportDTO>({
      url: `/v2/reports/dynamics?${queryString}`,
    });
  }
}
