import { action, computed, makeObservable, observable } from 'mobx';

import { Tag } from './models/tag';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { UsersRepository } from './users-repository';
import {
  CreateTagData,
  CreateTagResponse,
  GetTagsResponse,
  IApiTag,
  ITag,
  UpdateTagChanges,
  UpdateTagResponse,
} from '../types/tag';

export interface ITagsApi {
  getTags: () => Promise<GetTagsResponse>;
  createTag: (data: CreateTagData) => Promise<CreateTagResponse>;
  updateTag: (tagId: string, changes: UpdateTagChanges) => Promise<UpdateTagResponse>;
  deleteTag: (tagId: string) => Promise<void>;
}

export class TagsRepository extends ManageableStore {
  static storeName = 'TagsRepository';

  private _tags: Tag[] = [];

  constructor(mainStore: MainStore, private api: ITagsApi) {
    super(mainStore);

    makeObservable<TagsRepository, '_tags'>(this, {
      _tags: observable.shallow,
      tags: computed,
      consume: action,
      clear: action,
      deleteTag: action,
    });
  }

  get tags(): Tag[] {
    return this._tags.slice().sort(TagsRepository.sort);
  }

  private static sort(a: Tag, b: Tag): number {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }

  get(tagId: string): Tag | undefined {
    return this._tags.find(({ id }) => id === tagId);
  }

  consume(tags: IApiTag[]): void {
    this._tags = tags.map(tag => this.decode(tag));
  }

  getTags(): Promise<void> {
    return this.api.getTags().then(({ tags }) => {
      this.consume(tags);
    });
  }

  createTag(data: CreateTagData): Promise<void> {
    return this.api.createTag(data).then(
      action(response => {
        const tag = this.decode(response.tag);
        this._tags.push(tag);
      })
    );
  }

  updateTag(tag: Tag, changes: UpdateTagChanges): Promise<void> {
    return this.api.updateTag(tag.id, changes).then(
      action(response => {
        const updatedTag = this.decode(response.tag);
        const indexOf = this._tags.indexOf(tag);
        if (indexOf !== -1) {
          this._tags[indexOf] = updatedTag;
        } else {
          this._tags.push(updatedTag);
        }
      })
    );
  }

  deleteTag(tag: Tag): Promise<void> {
    tag.isDeleting = true;
    return this.api
      .deleteTag(tag.id)
      .then(
        action(() => {
          const indexOf = this._tags.indexOf(tag);
          if (indexOf !== -1) {
            this._tags.splice(indexOf, 1);
          }
        })
      )
      .finally(
        action(() => {
          tag.isDeleting = false;
        })
      );
  }

  private decode(tag: IApiTag): Tag {
    const { id, name, userId } = tag;
    const usersRepository = this.getStore(UsersRepository);

    const user = usersRepository.get(userId);
    if (!user) {
      throw new Error('User is not found');
    }

    return new Tag({
      id,
      name,
      user,
    });
  }

  clear(): void {
    this._tags = [];
  }
}
