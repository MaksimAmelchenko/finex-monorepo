import { AccountTypeService } from '../../../../services/account-type';
import { CurrencyService } from '../../../../services/currency';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ProjectService } from '../../../../services/project';
import { categoryPrototypeMapper } from '../../../../modules/category-prototype/category-prototype.mapper';
import { categoryPrototypeService } from '../../../../modules/category-prototype/category-prototype.service';
import { userMapper } from '../../../../modules/user/user.mapper';
import { userService } from '../../../../modules/user/user.service';
import { subscriptionService } from '../../../../modules/billing/subscription/subscription.service';

export async function handler(ctx: IRequestContext<unknown, true>): Promise<IResponse> {
  const {
    projectId,
    userId,
    params: { locale },
  } = ctx;

  const user = await userService.getUser(ctx, userId);

  const [
    //
    accountTypes,
    categoryPrototypes,
    currencies,
    dependencies,
    projects,
    users,
    subscription,
  ] = await Promise.all([
    //
    AccountTypeService.getAccountTypes(ctx),
    CurrencyService.getCurrencies(ctx),
    categoryPrototypeService.getCategoryPrototypes(ctx),
    ProjectService.getDependencies(ctx, projectId, userId),
    ProjectService.getProjects(ctx, userId),
    userService.getUsers(ctx, user.householdId),
    subscriptionService.getActiveSubscription(ctx, userId),
  ]);

  return {
    body: {
      accountTypes: accountTypes.map(accountType => accountType.toPublicModel()),
      currencies: currencies.map(currency => currency.toPublicModel()),
      categoryPrototypes: categoryPrototypes.map(categoryPrototype =>
        categoryPrototypeMapper.toDTO(categoryPrototype, locale)
      ),
      profile: userMapper.toProfile(user, subscription),
      projects: projects.map(project => project.toPublicModel()),
      users: users.map(user => userMapper.toDTO(user)),
      session: {
        projectId,
      },
      ...dependencies,
    },
  };
}
