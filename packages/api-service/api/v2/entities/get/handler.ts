import { AccountTypeService } from '../../../../services/account-type';
import { CategoryPrototypeService } from '../../../../services/category-prototype';
import { CurrencyService } from '../../../../services/currency';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ProjectService } from '../../../../services/project';
import { UserService } from '../../../../services/user';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const { projectId, userId } = ctx;

  const user = await UserService.getUser(ctx, userId);

  const [
    //
    accountTypes,
    categoryPrototypes,
    currencies,
    dependencies,
    projects,
    users,
  ] = await Promise.all([
    //
    AccountTypeService.getAccountTypes(ctx),
    CategoryPrototypeService.getCategoryPrototypes(ctx),
    CurrencyService.getCurrencies(ctx),
    ProjectService.getDependencies(ctx, projectId, userId),
    ProjectService.getProjects(ctx, userId),
    UserService.getUsers(ctx, String(user.idHousehold)),
  ]);

  return {
    body: {
      accountTypes: accountTypes.map(accountType => accountType.toPublicModel()),
      categoryPrototypes: categoryPrototypes.map(categoryPrototype => categoryPrototype.toPublicModel()),
      currencies: currencies.map(currency => currency.toPublicModel()),
      profile: user.toProfileModel(),
      projects: projects.map(project => project.toPublicModel()),
      users: users.map(user => user.toPublicModel()),
      session: {
        projectId,
      },
      ...dependencies,
    },
  };
}
