import { createCategory } from './methods/create-category';
import { deleteCategory } from './methods/delete-category';
import { getCategory } from './methods/get-category';
import { getCategoryByPrototype } from './methods/get-category-by-prototype';
import { getCategories } from './methods/get-categories';
import { moveCategory } from './methods/move-category';
import { updateCategory } from './methods/update-category';

export const CategoryGateway = {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryByPrototype,
  getCategories,
  moveCategory,
  updateCategory,
};
