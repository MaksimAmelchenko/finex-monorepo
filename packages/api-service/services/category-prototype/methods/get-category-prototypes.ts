import { CategoryPrototypeGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { CategoryPrototype } from '../model/category-prototype';

export async function getCategoryPrototypes(ctx: IRequestContext): Promise<CategoryPrototype[]> {
  return CategoryPrototypeGateway.getCategoryPrototypes(ctx);
}
