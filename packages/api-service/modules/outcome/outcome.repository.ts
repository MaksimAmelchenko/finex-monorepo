import { GetAccountDailyBalancesParamsRepositoryResponse, OutcomeRepository } from './types';
import { IRequestContext } from '../../types/app';
import { knex } from '../../knex';

class OutcomeRepositoryImpl implements OutcomeRepository {
  async getAccountDailyBalancesParams(
    ctx: IRequestContext,
    projectId: string,
    userId: string
  ): Promise<GetAccountDailyBalancesParamsRepositoryResponse> {
    ctx.log.trace({ projectId, userId }, 'try to account daily balance params');

    let query = knex.raw(
      `  with permit as
                (select a.id_project as project_id,
                        a.id_account as account_id,
                        7 as permit
                   from cf$.account a
                  where a.id_project = :projectId::int
                    and a.id_user = :userId::int
                  union all
                 select ap.id_project,
                        ap.id_account,
                        ap.permit
                   from cf$.account_permit ap
                  where ap.id_project = :projectId::int
                    and ap.id_user = :userId::int
                ),
              a as (
                select least(greatest(coalesce(min(cfi.cashflow_item_date), now()),
                                      now() - interval '5 months'),
                             now()) as start_date,
                       greatest(coalesce(max(cfi.cashflow_item_date), now()),
                                now()) as end_date
                  from cf$.v_cashflow_item cfi
                         join permit p
                              on (cfi.project_id = p.project_id
                                and cfi.account_id = p.account_id)
                 where cfi.project_id = :projectId::int),
              b as (
                select max(s.dplan) last_plan_date
                  from cf$.v_plan_v2 p,
                       cf$_plan.schedule(p.id, p.start_date, (now() + interval '5 months')::date) s
                 where p.project_id = :projectId::int
              )
       select to_char(date_trunc('month', start_date), 'YYYY-MM-DD') as "startDate",
              to_char(date_trunc('month', case
                                            when a.end_date < now() + interval '5 months' then
                                              greatest(a.end_date, b.last_plan_date)
                                            else
                                              a.end_date
                                            end + interval '2 months') - interval '1 day',
                      'YYYY-MM-DD') as "endDate"
         from a,
              b
      `,
      {
        projectId: Number(projectId),
        userId: Number(userId),
      }
    );
    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const {
      rows: [{ startDate, endDate }],
    } = await query;

    return {
      startDate,
      endDate,
    };
  }
}

export const outcomeRepository = new OutcomeRepositoryImpl();
