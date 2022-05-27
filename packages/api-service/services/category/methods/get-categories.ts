import { CategoryGateway } from '../gateway';
import { ICategory } from '../types';
import { IRequestContext } from '../../../types/app';

export async function getCategories(ctx: IRequestContext): Promise<ICategory[]> {
  return CategoryGateway.getCategories(ctx);
}
