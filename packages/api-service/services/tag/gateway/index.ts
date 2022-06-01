import { createTag } from './methods/create-tag';
import { deleteTag } from './methods/delete-tag';
import { getTag } from './methods/get-tag';
import { getTags } from './methods/get-tags';
import { updateTag } from './methods/update-tag';

export const TagGateway = {
  createTag,
  deleteTag,
  getTag,
  getTags,
  updateTag,
};
