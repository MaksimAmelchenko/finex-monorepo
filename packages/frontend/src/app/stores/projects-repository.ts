import { action, computed, makeObservable, observable } from 'mobx';

import { AccountsRepository } from './accounts-repository';
import { BalanceRepository } from './balance-repository';
import { CashFlowsRepository } from './cash-flows-repository';
import { CategoriesRepository } from './categories-repository';
import { ContractorsRepository } from './contractors-repository';
import {
  CopyProjectParams,
  CopyProjectResponse,
  CreateProjectData,
  CreateProjectResponse,
  GetProjectsResponse,
  IApiProject,
  MergeProjectParams,
  MergeProjectResponse,
  UpdateProjectChanges,
  UpdateProjectResponse,
  UseProjectResponse,
} from '../types/project';
import { DebtsRepository } from './debts-repository';
import { ExchangesRepository } from './exchanges-repository';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { MoneysRepository } from './moneys-repository';
import { OperationsRepository } from './operations-repository';
import { ParamsStore } from './params-store';
import { Project } from './models/project';
import { TagsRepository } from './tags-repository';
import { TransactionsRepository } from './transactions-repository';
import { TransfersRepository } from './transfers-repository';
import { UnitsRepository } from './units-repository';
import { User } from './models/user';
import { UsersRepository } from './users-repository';

export interface IProjectsApi {
  copyProject: (projectId: string, params: CopyProjectParams) => Promise<CopyProjectResponse>;
  createProject: (data: CreateProjectData) => Promise<CreateProjectResponse>;
  deleteProject: (projectId: string) => Promise<void>;
  getProjects: () => Promise<GetProjectsResponse>;
  mergeProject: (projectId: string, params: MergeProjectParams) => Promise<MergeProjectResponse>;
  updateProject: (projectId: string, changes: UpdateProjectChanges) => Promise<UpdateProjectResponse>;
  useProject: (projectId: string) => Promise<UseProjectResponse>;
}

export class ProjectsRepository extends ManageableStore {
  static storeName = 'ProjectsRepository';

  private _projects: Project[] = [];

  currentProjectId: string | null = null;

  constructor(mainStore: MainStore, private api: IProjectsApi) {
    super(mainStore);
    makeObservable<ProjectsRepository, '_projects'>(this, {
      _projects: observable.shallow,
      projects: computed,
      currentProjectId: observable,
      consume: action,
      setCurrentProject: action,
      currentProject: computed,
      clear: action,
      deleteProject: action,
    });
  }

  get projects(): Project[] {
    return this._projects.slice().sort(ProjectsRepository.sort);
  }

  private static sort(a: Project, b: Project): number {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }

  setCurrentProject(projectId: string): void {
    this.currentProjectId = projectId;
  }

  get currentProject(): Project | null {
    return this._projects.find(({ id }) => id === this.currentProjectId) || null;
  }

  get(projectId: string): Project | undefined {
    return this.projects.find(({ id }) => id === projectId);
  }

  consume(projects: IApiProject[]): void {
    this._projects = projects.map(project => this.decode(project));
  }

  getProjects(): Promise<void> {
    return this.api.getProjects().then(({ projects }) => {
      this.consume(projects);
    });
  }

  createProject(data: CreateProjectData): Promise<void> {
    return this.api.createProject(data).then(
      action(response => {
        const project = this.decode(response.project);
        this._projects.push(project);
      })
    );
  }

  updateProject(project: Project, changes: UpdateProjectChanges): Promise<void> {
    return this.api.updateProject(project.id, changes).then(
      action(response => {
        const updatedProject = this.decode(response.project);
        const indexOf = this._projects.indexOf(project);
        if (indexOf !== -1) {
          this._projects[indexOf] = updatedProject;
        } else {
          this._projects.push(updatedProject);
        }
      })
    );
  }

  deleteProject(project: Project): Promise<void> {
    project.isDeleting = true;
    return this.api
      .deleteProject(project.id)
      .then(
        action(() => {
          const indexOf = this._projects.indexOf(project);
          if (indexOf !== -1) {
            this._projects.splice(indexOf, 1);
          }
        })
      )
      .finally(
        action(() => {
          project.isDeleting = false;
        })
      );
  }

  decode(project: IApiProject): Project {
    const usersRepository = this.getStore(UsersRepository);

    const { id, userId, name, note, permit } = project;

    const user = usersRepository.get(userId);
    if (!user) {
      throw new Error('User is not found');
    }

    const editors: User[] = project.editors.reduce<User[]>((acc, userId) => {
      const user = usersRepository.get(userId);
      if (!user) {
        throw new Error('User is not found');
      }
      acc.push(user);

      return acc;
    }, []);

    return new Project({
      id,
      user,
      name,
      note,
      permit,
      editors,
    });
  }

  async useProject(projectId: string): Promise<void> {
    const { accounts, categories, contractors, moneys, params, tags, units } = await this.api.useProject(projectId);
    const accountsRepository = this.getStore(AccountsRepository);
    accountsRepository.consume(accounts);

    const categoriesRepository = this.getStore(CategoriesRepository);
    categoriesRepository.consume(categories);

    const contractorsRepository = this.getStore(ContractorsRepository);
    contractorsRepository.consume(contractors);

    const moneysRepository = this.getStore(MoneysRepository);
    moneysRepository.consume(moneys);

    // const projectsRepository = this.getStore(ProjectsRepository);
    // projectsRepository.consume(projects);

    const tagsRepository = this.getStore(TagsRepository);
    tagsRepository.consume(tags);

    const unitsRepository = this.getStore(UnitsRepository);
    unitsRepository.consume(units);

    const paramsStore = this.getStore(ParamsStore);
    paramsStore.consume(params);

    this.setCurrentProject(projectId!);

    this.getStore(BalanceRepository).clear();
    this.getStore(CashFlowsRepository).clear();
    this.getStore(DebtsRepository).clear();
    this.getStore(ExchangesRepository).clear();
    this.getStore(OperationsRepository).clear();
    this.getStore(TransactionsRepository).clear();
    this.getStore(TransfersRepository).clear();
  }

  async copyProject(projectId: string, params: CopyProjectParams): Promise<void> {
    return this.api.copyProject(projectId, params).then(
      action(response => {
        const project = this.decode(response.project);
        this._projects.push(project);
      })
    );
  }

  async mergeProject(projectId: string, params: MergeProjectParams): Promise<void> {
    return this.api.mergeProject(projectId, params).then(action(response => {}));
  }

  clear(): void {
    this._projects = [];
  }
}
