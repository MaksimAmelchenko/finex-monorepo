import { ApiRepository } from '../../core/other-stores/api-repository';
import { IProjectsApi } from '../projects-repository';
import { IUseProjectResponse } from '../../types/project';

export class ProjectsApi extends ApiRepository implements IProjectsApi {
  static storeName = 'ProjectsApi';

  useProject(projectId: string): Promise<IUseProjectResponse> {
    return this.fetch<IUseProjectResponse>({
      url: `/v1/projects/${projectId}/use`,
      method: 'PUT',
    });
  }
}
