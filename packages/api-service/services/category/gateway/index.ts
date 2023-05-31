import { createCategory } from './methods/create-category';
import { deleteCategory } from './methods/delete-category';
import { getCategories } from './methods/get-categories';
import { getCategoriesByPrototype } from './methods/get-categories-by-prototype';
import { getCategory } from './methods/get-category';
import { moveCategory } from './methods/move-category';
import { updateCategory } from './methods/update-category';

export const CategoryGateway = {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesByPrototype,
  getCategory,
  moveCategory,
  updateCategory,
};
