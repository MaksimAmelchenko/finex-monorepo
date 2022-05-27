import { createCategory } from './methods/create-category';
import { deleteCategory } from './methods/delete-category';
import { getCategories } from './methods/get-categories';
import { moveCategory } from './methods/move-category';
import { updateCategory } from './methods/update-category';

export const CategoryService = {
  createCategory,
  deleteCategory,
  getCategories,
  moveCategory,
  updateCategory,
};
