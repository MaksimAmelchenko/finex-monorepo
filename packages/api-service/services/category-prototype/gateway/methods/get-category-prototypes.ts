import { IRequestContext } from '../../../../types/app';
import { CategoryPrototype } from '../../model/category-prototype';

export async function getCategoryPrototypes(ctx: IRequestContext): Promise<CategoryPrototype[]> {
  ctx.log.trace('try to get category prototypes');

  return CategoryPrototype.query();
}
