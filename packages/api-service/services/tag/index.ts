import { createTag } from './methods/create-tag';
import { deleteTag } from './methods/delete-tag';
import { getTagByName } from './methods/get-tag-by-name';
import { getTags } from './methods/get-tags';
import { updateTag } from './methods/update-tag';

export const TagService = {
  createTag,
  deleteTag,
  getTagByName,
  getTags,
  updateTag,
};
