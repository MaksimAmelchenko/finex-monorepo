import { Knex } from 'knex';

import { plan_cashflow_item_bi_v1 } from './cf$/plan_cashflow_item_bi.function/v1';
import { plan_cashflow_item_bd_v1 } from './cf$/plan_cashflow_item_bd.function/v1';
import { plan_cashflow_item_bi_trigger_v1 } from './cf$/plan_cashflow_item_bi.trigger/v1';
import { v_plan_cashflow_item_v1 } from './cf$/v_plan_cashflow_item.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(plan_cashflow_item_bi_v1.up);
  await knex.schema.raw(plan_cashflow_item_bd_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('plan_cashflow_item', table => {
      table.comment('Планируемая операция дохода или расхода');
      table.integer('id_project').notNullable().comment('ID проекта');

      table
        .foreign('id_project', 'plan_cashflow_item_2_project')
        .references('id_project')
        .inTable('cf$.project')
        .onDelete('cascade');

      table.integer('id_plan').notNullable().comment('ID планируемой операции');

      table.integer('id_contractor').comment('ID контрагента');
      table
        .foreign(['id_project', 'id_contractor'], 'plan_cashflow_item_2_contractor')
        .references(['id_project', 'id_contractor'])
        .inTable('cf$.contractor');

      table.integer('id_account').notNullable().comment('ID счета');

      table.integer('id_category').notNullable().comment('ID категории');

      table.integer('id_money').notNullable().comment('ID деньги');

      table.integer('id_unit').comment('ID единицы измерения');
      table
        .foreign(['id_project', 'id_unit'], 'plan_cashflow_item_2_unit')
        .references(['id_project', 'id_unit'])
        .inTable('cf$.unit');

      table.specificType('sign', 'smallint').notNullable().comment('Знак операции: "-" - расход, "+" - прихода');

      table.specificType('quantity', 'numeric').comment('Количество');

      table.specificType('sum', 'numeric').notNullable().comment('Сумма');

      table.unique(['id_project', 'id_plan'], 'plan_cashflow_item_id_project_id_plan');

      // Для быстрой проверки по внешнему ключу при удалении статьи
      table.index(['id_project', 'id_category'], 'plan_cashflow_item_id_project_id_category');

      table.index(['id_project', 'id_account'], 'plan_cashflow_item_id_project_id_account');
    })
    .raw(
      'alter table cf$.plan_cashflow_item add constraint plan_cashflow_item_sign_check CHECK ((sign = ANY (ARRAY[(-1), 1])));'
    )
    .raw('alter table cf$.plan_cashflow_item add constraint plan_cashflow_item_sum_check CHECK ((sum > (0)::numeric));')
    .raw(
      'ALTER TABLE ONLY "cf$".plan_cashflow_item  ADD CONSTRAINT plan_cashflow_item_2_account FOREIGN KEY (id_project, id_account) REFERENCES "cf$".account(id_project, id_account) MATCH FULL;'
    )
    .raw(
      'ALTER TABLE ONLY "cf$".plan_cashflow_item ADD CONSTRAINT plan_cashflow_item_2_category FOREIGN KEY (id_project, id_category) REFERENCES "cf$".category(id_project, id_category) MATCH FULL;'
    )
    .raw(
      'ALTER TABLE ONLY "cf$".plan_cashflow_item  ADD CONSTRAINT plan_cashflow_item_2_money FOREIGN KEY (id_project, id_money) REFERENCES "cf$".money(id_project, id_money) MATCH FULL;'
    )
    .raw(
      'ALTER TABLE ONLY "cf$".plan_cashflow_item ADD CONSTRAINT plan_cashflow_item_2_plan FOREIGN KEY (id_project, id_plan) REFERENCES "cf$".plan(id_project, id_plan) MATCH FULL ON DELETE CASCADE;'
    )

    .raw(plan_cashflow_item_bi_trigger_v1.up);
  await knex.schema.raw(v_plan_cashflow_item_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_plan_cashflow_item_v1.down);
  await knex.schema.dropTable('cf$.plan_cashflow_item');
  await knex.schema.raw(plan_cashflow_item_bi_v1.down);
  await knex.schema.raw(plan_cashflow_item_bd_v1.down);
}
