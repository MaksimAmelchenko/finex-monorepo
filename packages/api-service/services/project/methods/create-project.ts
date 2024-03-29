import { CreateProjectServiceData } from '../types';

import { IRequestContext, Locale } from '../../../types/app';
import { Project } from '../model/project';
import { ProjectGateway } from '../gateway';
import { currencyRepository } from '../../../modules/currency/currency.repository';
import { getProject } from './get-project';
import { moneyService } from '../../../modules/money/money.service';
import { t } from '../../../libs/t';

export async function createProject(
  ctx: IRequestContext,
  userId: string,
  data: CreateProjectServiceData
): Promise<Project> {
  const { name, note } = data;
  const editors = data.editors ? data.editors.filter(id => id !== userId) : [];

  const project = await ProjectGateway.createProject(ctx, userId, { name, note });
  const projectId = String(project.idProject);

  // create category tree
  const knex = Project.knex();
  let query = knex.raw(
    `
      insert into cf$.category ( id_project,
                                 id_category,
                                 id_user,
                                 parent,
                                 id_unit,
                                 name,
                                 is_enabled,
                                 is_system,
                                 note,
                                 id_category_prototype )
        with recursive cpt as (select cp.id_category_prototype,
                                      nextval('cf$.category_id_category_seq') as id_category,
                                      cp.name,
                                      cp.parent,
                                      cp.is_system
                                 from cf$.category_prototype cp
                                where cp.parent is null
                                  and cp.is_enabled
                                union all
                               select cp.id_category_prototype,
                                      nextval('cf$.category_id_category_seq') as id_category,
                                      cp.name,
                                      cp.parent,
                                      cp.is_system
                                 from cpt
                                        join cf$.category_prototype cp
                                             on (cp.parent = cpt.id_category_prototype)
                                where cp.is_enabled
        )
      select :projectId::int,
             cpt1.id_category,
             :userId::int,
             cpt2.id_category as parent,
             null as id_unit,
             cpt1.name ->> :locale as name,
             true as is_enabled,
             cpt1.is_system,
             null as note,
             cpt1.id_category_prototype
        from cpt cpt1
               left join cpt cpt2
                         on cpt1.parent = cpt2.id_category_prototype
    `,
    {
      projectId: Number(projectId),
      userId: Number(userId),
      locale: ctx.params.locale,
    }
  );
  if (ctx.trx) {
    query = query.transacting(ctx.trx);
  }
  await query;

  const { locale } = ctx.params;

  const currencyCodes = {
    [Locale.Ru]: ['RUB', 'USD', 'EUR'],
    [Locale.En]: ['USD'],
    [Locale.De]: ['EUR'],
  }[locale];

  const currencies = await currencyRepository.getCurrencies(ctx);

  await Promise.all(
    currencyCodes.map((currencyCode, index) => {
      const currency = currencies.find(({ code }) => code === currencyCode)!;

      return moneyService.createMoney(ctx, projectId, userId, {
        name: t(currency.name, locale),
        currencyCode,
        isEnabled: true,
        symbol: currency.symbol,
        sorting: index + 1,
      });
    })
  );

  if (editors.length) {
    let query = knex.raw(
      `
        insert into cf$.project_permit ( id_project, id_user, permit )
          (select distinct
                  :projectId::int,
                  value::int,
                  3
             from jsonb_array_elements_text(:editors));
      `,
      {
        projectId: Number(projectId),
        editors: JSON.stringify(editors),
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    await query;
  }

  return getProject(ctx, projectId, userId);
}
