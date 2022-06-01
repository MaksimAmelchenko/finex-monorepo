import { User } from '../stores/models/user';

export interface IAPITag {
  id: string;
  name: string;
  userId: string;
}

export interface ITag {
  id: string;
  user: User;
  name: string;
}

export interface GetTagsResponse {
  tags: IAPITag[];
}

export interface CreateTagData {
  name: string;
}

export interface CreateTagResponse {
  tag: IAPITag;
}

export type UpdateTagChanges = Partial<{
  name: string;
  note: string;
}>;

export interface UpdateTagResponse {
  tag: IAPITag;
}
