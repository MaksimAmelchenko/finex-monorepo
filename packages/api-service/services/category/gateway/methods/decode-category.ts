import { ICategory } from '../../types';

export function decodeCategory(category: any): ICategory {
  return {
    id: String(category.idCategory),
    name: category.name,
    parent: category.parent ? String(category.parent) : null,
    categoryPrototypeId: category.idCategoryPrototype ? String(category.idCategoryPrototype) : null,
    isEnabled: category.isEnabled,
    note: category.note,
    unitId: category.idUnit ? String(category.idUnit) : null,
    isSystem: category.isSystem,
    userId: String(category.idUser),
  };
}
