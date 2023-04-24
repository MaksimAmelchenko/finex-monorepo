import { CategoryPrototype } from './models/category-prototype';
import { CategoryPrototypeMapper, ICategoryPrototype, ICategoryPrototypeDAO, ICategoryPrototypeDTO } from './types';
import { Locale } from '../../types/app';
import { t } from '../../libs/t';

class CategoryPrototypeMapperImpl implements CategoryPrototypeMapper {
  toDomain(categoryPrototypeDAO: ICategoryPrototypeDAO): ICategoryPrototype {
    const { idCategoryPrototype, parent, name, isEnabled, isSystem } = categoryPrototypeDAO;

    return new CategoryPrototype({
      id: String(idCategoryPrototype),
      name,
      parent: parent ? String(parent) : null,
      isEnabled,
      isSystem,
    });
  }

  toDTO(categoryPrototype: ICategoryPrototype, locale: Locale): ICategoryPrototypeDTO {
    const { id, name, parent, isEnabled, isSystem } = categoryPrototype;

    return {
      id,
      parent,
      name: t(name, locale),
      isEnabled,
      isSystem,
    };
  }
}

export const categoryPrototypeMapper = new CategoryPrototypeMapperImpl();
