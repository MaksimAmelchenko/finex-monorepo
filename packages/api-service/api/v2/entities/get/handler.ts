import { AccountTypeService } from '../../../../services/account-type';
import { CategoryPrototypeService } from '../../../../services/category-prototype';
import { CurrencyService } from '../../../../services/currency';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ProjectService } from '../../../../services/project';
import { userMapper } from '../../../../modules/user/user.mapper';
import { userService } from '../../../../modules/user/user.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse> {
  const { projectId, userId } = ctx;

  const user = await userService.getUser(ctx, userId);

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
    userService.getUsers(ctx, user.householdId),
  ]);

  return {
    body: {
      accountTypes: accountTypes.map(accountType => accountType.toPublicModel()),
      categoryPrototypes: categoryPrototypes.map(categoryPrototype => categoryPrototype.toPublicModel()),
      currencies: currencies.map(currency => currency.toPublicModel()),
      profile: userMapper.toProfile(user),
      projects: projects.map(project => project.toPublicModel()),
      users: users.map(user => userMapper.toDTO(user)),
      session: {
        projectId,
      },
      ...dependencies,
    },
  };
}
