import dbRequest from '../../../../libs/db-request';
import { AccountService } from '../../../../services/account';
import { CategoryPrototypeService } from '../../../../services/category-prototype';
import { CategoryService } from '../../../../services/category';
import { ContractorService } from '../../../../services/contractor';
import { CurrencyService } from '../../../../services/currency';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { MoneyService } from '../../../../services/money';
import { TagService } from '../../../../services/tag';
import { UnitService } from '../../../../services/unit';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const { projectId } = ctx;
  const [
    //
    response,
    accounts,
    categories,
    categoryPrototypes,
    contactors,
    units,
    tags,
    moneys,
    currencies,
  ] = await Promise.all([
    //
    dbRequest(ctx, 'cf.entity.get', {}),
    AccountService.getAccounts(ctx),
    CategoryService.getCategories(ctx),
    CategoryPrototypeService.getCategoryPrototypes(ctx),
    ContractorService.getContractors(ctx, projectId),
    UnitService.getUnits(ctx, projectId),
    TagService.getTags(ctx, projectId),
    MoneyService.getMoneys(ctx, projectId),
    CurrencyService.getCurrencies(ctx),
  ]);

  return {
    body: {
      ...response,
      accounts,
      categories,
      categoryPrototypes: categoryPrototypes
        // .filter(({ isSystem }) => !isSystem)
        .map(categoryPrototype => categoryPrototype.toPublicModel()),
      contractors: contactors.map(contactor => contactor.toPublicModel()),
      units: units.map(unit => unit.toPublicModel()),
      tags: tags.map(tag => tag.toPublicModel()),
      moneys: moneys.map(tag => tag.toPublicModel()),
      currencies: currencies.map(currency => currency.toPublicModel()),
    },
  };
}
