import { IUser } from '../../types/user';
import { IProject } from '../../types/project';
import { Permit } from '../../types';

export class Project implements IProject {
  readonly id: string;
  readonly user: IUser;
  name: string;
  note: string;
  readonly permit: Permit;
  writers: IUser[];

  constructor({ id, user, name, note, permit, writers }: IProject) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.note = note;
    this.permit = permit;
    this.writers = writers;
  }
}
