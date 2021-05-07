import { IUser } from '../../types/user';
import { ITag } from '../../types/tag';

export class Tag implements ITag {
  readonly id: string;
  readonly user: IUser;
  name: string;

  constructor({ id, user, name }: ITag) {
    this.id = id;
    this.user = user;
    this.name = name;
  }
}
