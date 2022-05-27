import { getRestApi } from '../../../libs/rest-api';

import { createCategory } from './create-category';
import { deleteCategory } from './delete-category';
import { getCategories } from './get-categories';
import { moveCategory } from './move-category';
import { updateCategory } from './update-category';

export const categoryApi = getRestApi([
  //
  createCategory,
  deleteCategory,
  getCategories,
  moveCategory,
  updateCategory,
]);
