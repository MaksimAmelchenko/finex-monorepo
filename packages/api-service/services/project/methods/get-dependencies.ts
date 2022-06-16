import { AccountService } from '../../account';
import { CategoryService } from '../../category';
import { ContractorService } from '../../contractor';
import { IRequestContext } from '../../../types/app';
import { MoneyService } from '../../money';
import { TagService } from '../../tag';
import { UnitService } from '../../unit';

export async function getDependencies(ctx: IRequestContext, projectId: string, userId: string): Promise<any> {
  const [accounts, categories, contractors, moneys, tags, units] = await Promise.all([
    AccountService.getAccounts(ctx, projectId, userId),
    CategoryService.getCategories(ctx, projectId),
    ContractorService.getContractors(ctx, projectId),
    MoneyService.getMoneys(ctx, projectId),
    TagService.getTags(ctx, projectId),
    UnitService.getUnits(ctx, projectId),
  ]);

  return {
    accounts: accounts.map(account => account.toPublicModel()),
    contractors: contractors.map(contractor => contractor.toPublicModel()),
    categories: categories.map(category => category.toPublicModel()),
    units: units.map(unit => unit.toPublicModel()),
    tags: tags.map(tag => tag.toPublicModel()),
    moneys: moneys.map(money => money.toPublicModel()),
    params: {
      dashboard: {
        dBegin: '2022-01-01',
        dEnd: '2022-07-01',
      },
    },
    badges: [
      {
        menuItem: 'ies_details',
        title: 'Количество запланированных операций',
        value: 0,
      },
      {
        menuItem: 'transfers',
        title: 'Количество запланированных переводов',
        value: 0,
      },
      {
        menuItem: 'exchanges',
        title: 'Количество запланированных обменов',
        value: 0,
      },
    ],
  };
}
