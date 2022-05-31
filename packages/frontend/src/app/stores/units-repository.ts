import { action, computed, makeObservable, observable } from 'mobx';

import { Unit } from './models/unit';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { UsersRepository } from './users-repository';
import {
  CreateUnitData,
  CreateUnitResponse,
  GetUnitsResponse,
  IAPIUnit,
  IUnit,
  UpdateUnitChanges,
  UpdateUnitResponse,
} from '../types/unit';

export interface IUnitsApi {
  getUnits: () => Promise<GetUnitsResponse>;
  createUnit: (data: CreateUnitData) => Promise<CreateUnitResponse>;
  updateUnit: (unitId: string, changes: UpdateUnitChanges) => Promise<UpdateUnitResponse>;
  deleteUnit: (unitId: string) => Promise<void>;
}

export class UnitsRepository extends ManageableStore {
  static storeName = 'UnitsRepository';

  private _units: Unit[] = [];

  constructor(mainStore: MainStore, private api: IUnitsApi) {
    super(mainStore);

    makeObservable<UnitsRepository, '_units'>(this, {
      _units: observable.shallow,
      units: computed,
      consume: action,
      clear: action,
      deleteUnit: action,
    });
  }

  get units(): Unit[] {
    return this._units.slice().sort(UnitsRepository.sort);
  }

  private static sort(a: Unit, b: Unit): number {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }

  get(unitId: string): Unit | undefined {
    return this._units.find(({ id }) => id === unitId);
  }

  consume(units: IAPIUnit[]): void {
    this._units = units.map(unit => this.decode(unit));
  }

  getUnits(): Promise<void> {
    return this.api.getUnits().then(({ units }) => {
      this.consume(units);
    });
  }

  createUnit(unit: Partial<IUnit> | Unit, data: CreateUnitData): Promise<void> {
    return this.api.createUnit(data).then(
      action(response => {
        const unit = this.decode(response.unit);
        this._units.push(unit);
      })
    );
  }

  updateUnit(unit: Unit, changes: UpdateUnitChanges): Promise<void> {
    return this.api.updateUnit(unit.id, changes).then(
      action(response => {
        const updatedUnit = this.decode(response.unit);
        const indexOf = this._units.indexOf(unit);
        if (indexOf !== -1) {
          this._units[indexOf] = updatedUnit;
        } else {
          this._units.push(updatedUnit);
        }
      })
    );
  }

  deleteUnit(unit: Unit): Promise<void> {
    unit.isDeleting = true;
    return this.api
      .deleteUnit(unit.id)
      .then(
        action(() => {
          const indexOf = this._units.indexOf(unit);
          if (indexOf !== -1) {
            this._units.splice(indexOf, 1);
          }
          // this._units = this._units.filter(a => a !== unit);
        })
      )
      .finally(
        action(() => {
          unit.isDeleting = false;
        })
      );
  }

  private decode(unit: IAPIUnit): Unit {
    const { id, name, userId } = unit;
    const usersRepository = this.getStore(UsersRepository);

    const user = usersRepository.get(userId);
    if (!user) {
      throw new Error('User is not found');
    }

    return new Unit({
      id,
      name,
      user,
    });
  }

  clear(): void {
    this._units = [];
  }
}
