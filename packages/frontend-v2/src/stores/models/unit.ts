import { IUnit } from '../../types/unit';
import { IUser } from '../../types/user';

export class Unit implements IUnit {
  readonly id: string;
  readonly user: IUser;
  name: string;

  constructor({ id, user, name }: IUnit) {
    this.id = id;
    this.user = user;
    this.name = name;
  }
}
