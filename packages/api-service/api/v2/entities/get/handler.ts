import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { IResponse } from '../../../../libs/rest-api/types';
import { AccountService } from '../../../../services/account';
import { CategoryService } from '../../../../services/category';
import { CategoryPrototypeService } from '../../../../services/category-prototype';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const [response, accounts, categories, categoryPrototypes] = await Promise.all([
    //
    dbRequest(ctx, 'cf.entity.get', {}),
    AccountService.getAccounts(ctx),
    CategoryService.getCategories(ctx),
    CategoryPrototypeService.getCategoryPrototypes(ctx),
  ]);

  return {
    body: {
      ...response,
      accounts,
      categories,
      categoryPrototypes: categoryPrototypes
        // .filter(({ isSystem }) => !isSystem)
        .map(categoryPrototype => categoryPrototype.toPublicModel()),
    },
  };
}
