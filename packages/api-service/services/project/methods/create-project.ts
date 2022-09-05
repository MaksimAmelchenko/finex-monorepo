import { CreateProjectServiceData } from '../types';
import { CurrencyGateway } from '../../currency/gateway';
import { IRequestContext } from '../../../types/app';
import { MoneyService } from '../../money';
import { Project } from '../model/project';
import { ProjectGateway } from '../gateway';
import { getProject } from './get-project';

export async function createProject(
  ctx: IRequestContext,
  userId: string,
  data: CreateProjectServiceData
): Promise<Project> {
  const { name, note } = data;
  const editors = data.editors ? data.editors.filter(id => id !== userId) : [];

  const project = await ProjectGateway.createProject(ctx, userId, { name, note });

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
      select :id_project,
             cpt1.id_category,
             :id_user,
             cpt2.id_category as parent,
             null as id_unit,
             cpt1.name,
             true as is_enabled,
             cpt1.is_system,
             null as note,
             cpt1.id_category_prototype
        from cpt cpt1
               left join cpt cpt2
                         on cpt1.parent = cpt2.id_category_prototype
    `,
    {
      id_project: project.idProject,
      id_user: Number(userId),
    }
  );
  if (ctx.trx) {
    query = query.transacting(ctx.trx);
  }
  await query;

  const currencies = await CurrencyGateway.getCurrencies(ctx);
  // TODO create money according to locale
  await Promise.all(
    [643, 978, 840].map((currencyId, index) => {
      const currency = currencies.find(({ idCurrency }) => idCurrency === currencyId)!;
      return MoneyService.createMoney(ctx, String(project.idProject), userId, {
        name: currency.name,
        currencyId: String(currency.idCurrency),
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
                  :id_project::int,
                  value::int,
                  3
             from jsonb_array_elements_text(:editors));
      `,
      {
        id_project: project.idProject,
        editors: JSON.stringify(editors),
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    await query;
  }

  return getProject(ctx, String(project.idProject), userId);
}
