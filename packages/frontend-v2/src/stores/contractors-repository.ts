import { action, makeObservable, observable } from 'mobx';

import { ManageableStore } from '../core/manageable-store';
import { MainStore } from '../core/main-store';
import { UsersRepository } from './users-repository';
import { Contractor } from './models/contractor';
import { IContractor, IContractorRaw } from '../types/contractor';

export interface IContractorsApi {}

export class ContractorsRepository extends ManageableStore {
  static storeName = 'ContractorsRepository';

  contractors: IContractor[] = [];

  constructor(mainStore: MainStore, private api: IContractorsApi) {
    super(mainStore);
    makeObservable(this, {
      contractors: observable.shallow,
      consume: action,
      clear: action,
    });
  }

  consume(contractors: IContractorRaw[]): void {
    const usersRepository = this.getStore(UsersRepository);
    this.contractors = contractors.reduce((acc, contractorRaw) => {
      const { idContractor, idUser, name, note } = contractorRaw;
      const user = usersRepository.get(String(idUser));
      if (!user) {
        console.warn('User is not found', { contractorRaw });

        return acc;
      }

      const contractor = new Contractor({
        id: String(idContractor),
        user,
        name,
        note,
      });
      acc.push(contractor);
      return acc;
    }, [] as Contractor[]);
  }

  get(contractorId: string): IContractor | undefined {
    return this.contractors.find(({ id }) => id === contractorId);
  }

  clear(): void {
    this.contractors = [];
  }
}
