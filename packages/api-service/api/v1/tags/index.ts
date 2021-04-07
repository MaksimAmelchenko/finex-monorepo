import { getRestApi } from '../../../libs/rest-api';

import { createTag } from './create-tag';
import { deleteTag } from './delete-tag';
import { getTag } from './get-tag';
import { getTags } from './get-tags';
import { updateTag } from './update-tag';

export const tagsApi = getRestApi([
  //
  createTag,
  deleteTag,
  getTag,
  getTags,
  updateTag,
]);
