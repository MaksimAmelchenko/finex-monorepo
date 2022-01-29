import { action, makeObservable, observable } from 'mobx';

import { ManageableStore } from '../core/manageable-store';
import { MainStore } from '../core/main-store';
import { UsersRepository } from './users-repository';
import { IUser } from '../types/user';
import { IProject, IProjectRaw, IUseProjectResponse } from '../types/project';
import { Project } from './models/project';
import { AccountsRepository } from './accounts-repository';
import { CategoriesRepository } from './categories-repository';
import { ContractorsRepository } from './contractors-repository';
import { MoneysRepository } from './moneys-repository';
import { TagsRepository } from './tags-repository';
import { UnitsRepository } from './units-repository';

export interface IProjectsApi {
  useProject: (projectId: string) => Promise<IUseProjectResponse>;
}

export class ProjectsRepository extends ManageableStore {
  static storeName = 'ProjectsRepository';

  projects: IProject[] = [];
  currentProject: Project | null = null;

  constructor(mainStore: MainStore, private api: IProjectsApi) {
    super(mainStore);
    makeObservable(this, {
      projects: observable.shallow,
      currentProject: observable,
      setCurrentProject: action,
      consume: action,
      clear: action,
    });
  }

  consume(projects: IProjectRaw[]): void {
    const usersRepository = this.getStore(UsersRepository);

    this.projects = projects.reduce((acc, projectRow) => {
      const { idProject, idUser, name, note, permit } = projectRow;

      const user = usersRepository.get(String(idUser));
      if (!user) {
        console.warn('User is not found', { projectRow });
        return acc;
      }

      const writers: IUser[] = projectRow.writers.reduce((acc, idUser) => {
        const user = usersRepository.get(String(idUser));
        if (!user) {
          console.warn('Writer is not found', { projectRow });
          return acc;
        }
        acc.push(user);

        return acc;
      }, [] as IUser[]);

      const project = new Project({
        id: String(idProject),
        user,
        name,
        note,
        permit,
        writers,
      });

      acc.push(project);
      return acc;
    }, [] as IProject[]);
  }

  setCurrentProject(project: IProject): void {
    this.currentProject = project;
  }

  get(projectId: string): IProject | undefined {
    return this.projects.find(({ id }) => id === projectId);
  }

  async useProject(projectId: string): Promise<void> {
    const { accounts, categories, contractors, moneys, tags, units, params } = await this.api.useProject(projectId);
    const accountsRepository = this.getStore(AccountsRepository);
    accountsRepository.consume(accounts);

    const categoriesRepository = this.getStore(CategoriesRepository);
    categoriesRepository.consume(categories);

    const contractorsRepository = this.getStore(ContractorsRepository);
    contractorsRepository.consume(contractors);

    const moneysRepository = this.getStore(MoneysRepository);
    moneysRepository.consume(moneys);

    const tagsRepository = this.getStore(TagsRepository);
    tagsRepository.consume(tags);

    const unitsRepository = this.getStore(UnitsRepository);
    unitsRepository.consume(units);

    this.setCurrentProject(this.get(projectId)!);
  }

  clear(): void {
    this.projects = [];
  }
}
