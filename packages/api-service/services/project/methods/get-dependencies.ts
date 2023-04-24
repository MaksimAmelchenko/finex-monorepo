import { AccountService } from '../../account';
import { CategoryService } from '../../category';
import { ContractorService } from '../../contractor';
import { IRequestContext } from '../../../types/app';
import { TagService } from '../../tag';
import { UnitService } from '../../unit';
import { moneyService } from '../../../modules/money/money.service';
import { outcomeRepository } from '../../../modules/outcome/outcome.repository';
import { moneyMapper } from '../../../modules/money/money.mapper';

export async function getDependencies(ctx: IRequestContext, projectId: string, userId: string): Promise<any> {
  const [accounts, categories, contractors, moneys, tags, units, accountDailyBalancesParams] = await Promise.all([
    AccountService.getAccounts(ctx, projectId, userId),
    CategoryService.getCategories(ctx, projectId),
    ContractorService.getContractors(ctx, projectId),
    moneyService.getMoneys(ctx, projectId),
    TagService.getTags(ctx, projectId),
    UnitService.getUnits(ctx, projectId),
    outcomeRepository.getAccountDailyBalancesParams(ctx, projectId, userId),
  ]);

  return {
    accounts: accounts.map(account => account.toPublicModel()),
    contractors: contractors.map(contractor => contractor.toPublicModel()),
    categories: categories.map(category => category.toPublicModel()),
    units: units.map(unit => unit.toPublicModel()),
    tags: tags.map(tag => tag.toPublicModel()),
    moneys: moneys.map(money => moneyMapper.toDTO(money)),
    params: {
      outcome: {
        accountDailyBalances: accountDailyBalancesParams,
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
