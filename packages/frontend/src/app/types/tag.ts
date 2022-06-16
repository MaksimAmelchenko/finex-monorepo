import { User } from '../stores/models/user';

export interface IApiTag {
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
  tags: IApiTag[];
}

export interface CreateTagData {
  name: string;
}

export interface CreateTagResponse {
  tag: IApiTag;
}

export type UpdateTagChanges = Partial<{
  name: string;
  note: string;
}>;

export interface UpdateTagResponse {
  tag: IApiTag;
}
