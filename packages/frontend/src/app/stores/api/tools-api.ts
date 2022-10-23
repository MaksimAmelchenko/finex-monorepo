import { ApiRepository } from '../../core/other-stores/api-repository';
import { IToolsApi } from '../../types/tool';

export class ToolsApi extends ApiRepository implements IToolsApi {
  static override storeName = 'ToolsApi';

  exportData(): Promise<void> {
    return this.fetch<void>({
      method: 'POST',
      url: '/v1/export-to-csv',
    });
  }
}
