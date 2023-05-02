import {
  AccountRepository,
  IAccountBalances,
  IAccountDailyBalance,
  IAccountsBalancesParams,
  IAccountsDailyBalancesParams,
} from './types';
import { IRequestContext } from '../../types/app';
import { knex } from '../../knex';

class AccountRepositoryImpl implements AccountRepository {
  async getBalances(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    params: IAccountsBalancesParams
  ): Promise<IAccountBalances[]> {
    ctx.log.trace({ params }, 'try to get accounts balances');

    const { balanceDate, moneyId } = params;

    let query = knex.raw(
      `
          with --
               params as (
                 select u.id_currency_rate_source as currency_rate_source_id
                   from core$.user u
                  where u.id_user = :userId::int
               ),
               permit as (
                 select project_id,
                        account_id,
                        permit
                   from params, cf$_account.permit(:projectId::int, :userId::int)
               ),
               ab as (
                 select row_number()
                        over (partition by ab.id_account, ab.id_money order by ab.dbalance desc) as rn,
                        ab.id_account,
                        ab.id_money,
                        sum(ab.sum_in - ab.sum_out)
                        over (partition by ab.id_account, ab.id_money order by ab.dbalance) as amount
                   from permit
                          join cf$.account a
                               on (a.id_project = permit.project_id
                                 and a.id_account = permit.account_id)
                          join cf$.account_balance ab
                               using (id_project, id_account)
                  where ab.dbalance <= :balanceDate::date
               ),
               b as (
                 select ab.id_account,
                        ab.id_money,
                        ab.amount
                   from ab
                  where ab.rn = 1
               ),
               cb as (
                 select b.id_account::text as account_id,
                        b.id_money::text as money_id,
                        b.amount
                   from b
                  where :moneyId::int is null
                  union all
                 select b.id_account::text as account_id,
                        :moneyId::text as money_id,
                        sum(cf$_money.exchange(p_project_id => :projectId::int,
                                               p_amount => b.amount,
                                               p_from_money_id => b.Id_Money,
                                               p_to_money_id => :moneyId::int,
                                               p_rate_date => :balanceDate::date,
                                               p_currency_rate_source_id => params.currency_rate_source_id,
                                               p_is_round => true)) as amount
                   from b,
                        params
                  where :moneyId::int is not null
                  group by b.Id_Account,
                           :moneyId::int
               )
        select json_build_object('accountId', cb.account_id,
                                 'balances', json_agg(
                                   json_build_object(
                                     'moneyId', money_id,
                                     'amount', amount
                                     ))) as "accountBalances"
          from cb
         group by account_id

      `,
      {
        projectId: Number(projectId),
        userId: Number(userId),
        balanceDate,
        moneyId: moneyId ? Number(moneyId) : null,
      }
    );

    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows } = await query;

    return rows.map(row => row.accountBalances);
  }

  async getDailyBalances(
    ctx: IRequestContext<unknown, true>,
    projectId: string,
    userId: string,
    params: IAccountsDailyBalancesParams
  ): Promise<IAccountDailyBalance[]> {
    ctx.log.trace({ params }, 'try to get accounts daily balances');

    const { startDate, endDate, moneyId } = params;

    let query = knex.raw(
      `
          with --
               p as (
                 select u.id_currency_rate_source as currency_rate_source_id
                   from core$.user u
                  where u.id_user = :userId::int
               ),
               ab as (
                 select ab.money_id,
                        ab.balance_date,
                        ab.account_id,
                        ab.amount_in,
                        ab.amount_out
                   from cf$_account.account_balance_with_plan(:projectId::int, :userId::int, :endDate::date) ab
                          join cf$.money m
                               on (m.id_project = ab.project_id
                                 and m.id_money = ab.money_id)
                  where m.is_enabled
               ),
               acr as (
                 -- all dates
                 select ab.account_id,
                        generate_series(greatest(min(ab.balance_date), :startDate::date)::timestamp,
                                        :endDate::timestamp,
                                        '1 days')::date as balance_date,
                        ab.money_id
                   from ab
                  group by ab.account_id,
                           ab.money_id
               ),
               -- extend with start, end and intermediate points
               abe as (
                 select ab.money_id,
                        ab.balance_date,
                        ab.account_id,
                        ab.amount_in,
                        ab.amount_out
                   from ab
                  union all
                 select acr.money_id,
                        acr.balance_date,
                        acr.account_id,
                        0 as amount_in,
                        0 as amount_out
                   from acr
                  where (acr.money_id, acr.balance_date, acr.account_id) not in (
                    select ab.money_id,
                           ab.balance_date,
                           ab.account_id
                      from ab)
               ),
               -- balances in current money
               b as (
                 select abe.money_id,
                        abe.balance_date,
                        abe.account_id,
                        sum(abe.amount_in - abe.amount_out)
                        over (partition by abe.money_id, abe.account_id order by abe.balance_date) as amount
                   from abe
               ),
               o as (
                 select b.money_id,
                        b.balance_date,
                        b.account_id,
                        b.amount
                   from b
                  where :moneyId::int is null
                    and b.balance_date >= :startDate::date
                  union all
                 select :moneyId::int as money_id,
                        b.balance_date,
                        b.account_id,
                        sum(cf$_money.exchange(p_project_id => :projectId::int,
                                               p_amount => b.amount,
                                               p_from_money_id => b.money_id,
                                               p_to_money_id => :moneyId::int,
                                               p_rate_date => b.balance_date,
                                               p_currency_rate_source_id => p.currency_rate_source_id,
                                               p_is_round => true)) as amount
                   from p,
                        b
                  where :moneyId::int is not null
                    and b.balance_date >= :startDate::date
                  group by b.balance_date,
                           b.account_id
               ),
               ofl as (
                 select money_id,
                        balance_date,
                        account_id,
                        amount,
                        lag(amount) over (partition by money_id, account_id order by balance_date) prev_amount,
                        lead(amount) over (partition by money_id, account_id order by balance_date) next_amount
                   from o
               ),
               account_balances as (
                 select ofl.money_id,
                        ofl.account_id,
                        json_agg(json_build_object(
                          'date', to_char(ofl.balance_date, 'YYYY-MM-DD'),
                          'amount', ofl.amount)) as balances
                   from ofl
                        -- delete redundant information
                  where ofl.prev_amount is null
                     or ofl.next_amount is null
                     or ofl.prev_amount != ofl.amount
                     or ofl.next_amount != ofl.amount
                  group by ofl.money_id,
                           ofl.account_id
               )
        select money_id::text as "moneyId",
               json_agg(json_build_object(
                 'accountId', account_id::text,
                 'balances', balances)) as accounts
          from account_balances
         group by money_id
      `,
      {
        projectId: Number(projectId),
        userId: Number(userId),
        startDate,
        endDate,
        moneyId: moneyId ? Number(moneyId) : null,
      }
    );

    if (ctx.trx) {
      query = query.transacting(ctx.trx);
    }
    const { rows } = await query;

    return rows;
  }
}

export const accountRepository = new AccountRepositoryImpl();
