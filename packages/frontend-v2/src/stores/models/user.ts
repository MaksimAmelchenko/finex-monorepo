import { IUser } from '../../types/user';

export class User implements IUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;

  constructor({ id, name, email }: IUser) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
