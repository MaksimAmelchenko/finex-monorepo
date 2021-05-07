import { ApiRepository } from '../../core/other-stores/api-repository';
import { IProjectsApi } from '../projects-repository';

export class ProjectsApi extends ApiRepository implements IProjectsApi {
  static storeName = 'ProjectsApi';
}
