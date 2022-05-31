import { action, computed, makeObservable, observable } from 'mobx';

import { Contractor } from './models/contractor';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { UsersRepository } from './users-repository';
import {
  CreateContractorData,
  CreateContractorResponse,
  GetContractorsResponse,
  IAPIContractor,
  IContractor,
  UpdateContractorChanges,
  UpdateContractorResponse,
} from '../types/contractor';

export interface IContractorsApi {
  getContractors: () => Promise<GetContractorsResponse>;
  createContractor: (data: CreateContractorData) => Promise<CreateContractorResponse>;
  updateContractor: (contractorId: string, changes: UpdateContractorChanges) => Promise<UpdateContractorResponse>;
  deleteContractor: (contractorId: string) => Promise<void>;
}

export class ContractorsRepository extends ManageableStore {
  static storeName = 'ContractorsRepository';

  private _contractors: Contractor[] = [];

  constructor(mainStore: MainStore, private api: IContractorsApi) {
    super(mainStore);

    makeObservable<ContractorsRepository, '_contractors'>(this, {
      _contractors: observable.shallow,
      contractors: computed,
      consume: action,
      clear: action,
      deleteContractor: action,
    });
  }

  get contractors(): Contractor[] {
    return this._contractors.slice().sort(ContractorsRepository.sort);
  }

  private static sort(a: Contractor, b: Contractor): number {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }

  get(contractorId: string): Contractor | undefined {
    return this._contractors.find(({ id }) => id === contractorId);
  }

  consume(contractors: IAPIContractor[]): void {
    this._contractors = contractors.map(contractor => this.decode(contractor));
  }

  getContractors(): Promise<void> {
    return this.api.getContractors().then(({ contractors }) => {
      this.consume(contractors);
    });
  }

  createContractor(contractor: Partial<IContractor> | Contractor, data: CreateContractorData): Promise<void> {
    return this.api.createContractor(data).then(
      action(response => {
        const contractor = this.decode(response.contractor);
        this._contractors.push(contractor);
      })
    );
  }

  updateContractor(contractor: Contractor, changes: UpdateContractorChanges): Promise<void> {
    return this.api.updateContractor(contractor.id, changes).then(
      action(response => {
        const updatedContractor = this.decode(response.contractor);
        const indexOf = this._contractors.indexOf(contractor);
        if (indexOf !== -1) {
          this._contractors[indexOf] = updatedContractor;
        } else {
          this._contractors.push(updatedContractor);
        }
      })
    );
  }

  deleteContractor(contractor: Contractor): Promise<void> {
    contractor.isDeleting = true;
    return this.api
      .deleteContractor(contractor.id)
      .then(
        action(() => {
          const indexOf = this._contractors.indexOf(contractor);
          if (indexOf !== -1) {
            this._contractors.splice(indexOf, 1);
          }
          // this._contractors = this._contractors.filter(a => a !== contractor);
        })
      )
      .finally(
        action(() => {
          contractor.isDeleting = false;
        })
      );
  }

  private decode(contractor: IAPIContractor): Contractor {
    const { id, name, note = '', userId } = contractor;
    const usersRepository = this.getStore(UsersRepository);

    const user = usersRepository.get(userId);
    if (!user) {
      throw new Error('User is not found');
    }

    return new Contractor({
      id,
      name,
      note,
      user,
    });
  }

  clear(): void {
    this._contractors = [];
  }
}
