import { action, makeObservable, observable } from 'mobx';

import { ManageableStore } from '../core/manageable-store';
import { MainStore } from '../core/main-store';
import { Unit } from './models/unit';
import { UsersRepository } from './users-repository';
import { IUnit, IUnitRaw } from '../types/unit';

export interface IUnitsApi {}

export class UnitsRepository extends ManageableStore {
  static storeName = 'UnitsRepository';

  units: IUnit[] = [];

  constructor(mainStore: MainStore, private api: IUnitsApi) {
    super(mainStore);
    makeObservable(this, {
      units: observable.shallow,
      consume: action,
      clear: action,
    });
  }

  consume(units: IUnitRaw[]): void {
    const usersRepository = this.getStore(UsersRepository);
    this.units = units.reduce((acc, unitRow) => {
      const { idUnit, idUser, name } = unitRow;
      const user = usersRepository.get(String(idUser));
      if (!user) {
        console.warn('User is not found', { unitRow });
        return acc;
      }

      const unit = new Unit({
        id: String(idUnit),
        user,
        name,
      });
      acc.push(unit);
      return acc;
    }, [] as Unit[]);
  }

  get(unitId: string): IUnit | undefined {
    return this.units.find(({ id }) => id === unitId);
  }

  clear(): void {
    this.units = [];
  }
}
