import { IUser } from '../../types/user';
import { IContractor } from '../../types/contractor';

export class Contractor implements IContractor {
  readonly id: string;
  readonly user: IUser;
  name: string;
  note: string;

  constructor({ id, user, name, note }: IContractor) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.note = note;
  }
}
