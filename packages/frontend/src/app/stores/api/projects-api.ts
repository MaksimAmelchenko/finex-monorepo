import { ApiRepository } from '../../core/other-stores/api-repository';
import { IProjectsApi } from '../projects-repository';
import {
  CopyProjectParams,
  CopyProjectResponse,
  CreateProjectData,
  CreateProjectResponse,
  GetProjectsResponse,
  MergeProjectParams,
  MergeProjectResponse,
  UpdateProjectChanges,
  UpdateProjectResponse,
  UseProjectResponse,
} from '../../types/project';

export class ProjectsApi extends ApiRepository implements IProjectsApi {
  static override storeName = 'ProjectsApi';

  getProjects(): Promise<GetProjectsResponse> {
    return this.fetch<GetProjectsResponse>({
      method: 'GET',
      url: '/v2/projects',
    });
  }

  createProject(data: CreateProjectData): Promise<CreateProjectResponse> {
    return this.fetch<CreateProjectResponse>({
      method: 'POST',
      url: '/v2/projects',
      body: data,
    });
  }

  updateProject(projectId: string, changes: UpdateProjectChanges): Promise<UpdateProjectResponse> {
    return this.fetch<CreateProjectResponse>({
      method: 'PATCH',
      url: `/v2/projects/${projectId}`,
      body: changes,
    });
  }

  deleteProject(projectId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/projects/${projectId}`,
    });
  }

  useProject(projectId: string): Promise<UseProjectResponse> {
    return this.fetch<UseProjectResponse>({
      url: `/v2/projects/${projectId}/use`,
      method: 'PUT',
    });
  }

  copyProject(projectId: string, params: CopyProjectParams): Promise<CopyProjectResponse> {
    return this.fetch<CopyProjectResponse>({
      url: `/v2/projects/${projectId}/copy`,
      method: 'POST',
      body: params,
    });
  }

  mergeProject(projectId: string, params: MergeProjectParams): Promise<MergeProjectResponse> {
    return this.fetch<MergeProjectResponse>({
      url: `/v2/projects/${projectId}/merge`,
      method: 'PUT',
      body: params,
    });
  }
}
