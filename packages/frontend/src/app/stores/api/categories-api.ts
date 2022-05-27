import { ApiRepository } from '../../core/other-stores/api-repository';
import { ICategoriesApi } from '../categories-repository';
import {
  CreateCategoryData,
  CreateCategoryResponse,
  GetCategoriesResponse,
  UpdateCategoryChanges,
  UpdateCategoryResponse,
} from '../../types/category';

export class CategoriesApi extends ApiRepository implements ICategoriesApi {
  static override storeName = 'CategoriesApi';

  getCategories(): Promise<GetCategoriesResponse> {
    return this.fetch<GetCategoriesResponse>({
      method: 'GET',
      url: '/v2/categories',
    });
  }

  createCategory(data: CreateCategoryData): Promise<CreateCategoryResponse> {
    return this.fetch<CreateCategoryResponse>({
      method: 'POST',
      url: '/v2/categories',
      body: data,
    });
  }

  updateCategory(categoryId: string, changes: UpdateCategoryChanges): Promise<UpdateCategoryResponse> {
    return this.fetch<CreateCategoryResponse>({
      method: 'PATCH',
      url: `/v2/categories/${categoryId}`,
      body: changes,
    });
  }

  deleteCategory(categoryId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/categories/${categoryId}`,
    });
  }

  moveTransactions(categoryId: string, categoryIdTo: string, isRecursive: boolean): Promise<{ count: number }> {
    return this.fetch<{ count: number }>({
      method: 'PUT',
      url: `/v2/categories/${categoryId}/move`,
      body: {
        categoryIdTo,
        isRecursive,
      },
    });
  }
}
