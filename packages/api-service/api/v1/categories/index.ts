import { getRestApi } from '../../../libs/rest-api';

import { createCategory } from './create-category';
import { deleteCategory } from './delete-category';
import { getCategories } from './get-categories';
import { getCategory } from './get-category';
import { moveCategory } from './move-category';
import { updateCategory } from './update-category';

export const categoriesApi = getRestApi([
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  moveCategory,
  updateCategory,
]);
