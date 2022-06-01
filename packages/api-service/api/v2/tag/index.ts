import { getRestApi } from '../../../libs/rest-api';

import { createTag } from './create-tag';
import { deleteTag } from './delete-tag';
import { getTags } from './get-tags';
import { updateTag } from './update-tag';

export const tagApi = getRestApi([
  //
  createTag,
  deleteTag,
  getTags,
  updateTag,
]);
