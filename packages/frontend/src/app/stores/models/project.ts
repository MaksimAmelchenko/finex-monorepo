import { action, makeObservable, observable } from 'mobx';

import { IDeletable, ISelectable, Permit } from '../../types';
import { IProject } from '../../types/project';
import { User } from './user';

export class Project implements IProject, IDeletable {
  readonly id: string;
  readonly user: User;
  name: string;
  note: string;
  readonly permit: Permit;
  editors: User[];

  isDeleting: boolean;

  constructor({ id, user, name, note, permit, editors }: IProject) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.note = note;
    this.permit = permit;
    this.editors = editors;

    this.isDeleting = false;

    makeObservable(this, {
      isDeleting: observable,
    });
  }
}
