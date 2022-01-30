import { action, makeObservable, observable } from 'mobx';

import { ManageableStore } from '../core/manageable-store';
import { MainStore } from '../core/main-store';
import { UsersRepository } from './users-repository';
import { ITag, ITagRaw } from '../types/tag';
import { Tag } from './models/tag';

export interface ITagsApi {}

export class TagsRepository extends ManageableStore {
  static storeName = 'TagsRepository';

  tags: ITag[] = [];

  constructor(mainStore: MainStore, private api: ITagsApi) {
    super(mainStore);
    makeObservable(this, {
      tags: observable.shallow,
      consume: action,
      clear: action,
    });
  }

  consume(tags: ITagRaw[]): void {
    const usersRepository = this.getStore(UsersRepository);
    this.tags = tags.reduce((acc, tagRow) => {
      const { idTag, idUser, name } = tagRow;
      const user = usersRepository.get(String(idUser));
      if (!user) {
        console.warn('User is not found', { tagRow });
        return acc;
      }

      const tag = new Tag({
        id: String(idTag),
        user,
        name,
      });
      acc.push(tag);
      return acc;
    }, [] as Tag[]);
  }

  get(tagId: string): Tag | undefined {
    return this.tags.find(({ id }) => id === tagId);
  }

  clear(): void {
    this.tags = [];
  }
}
