import * as Knex from 'knex';

import { plan_exchange_bi_v1 } from './cf$/plan_exchange_bi.function/v1';
import { plan_exchange_bi_trigger_v1 } from './cf$/plan_exchange_bi.trigger/v1';
import { v_plan_exchange_v1 } from './cf$/v_plan_exchange.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(plan_exchange_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('plan_exchange', table => {
      table.integer('id_project').notNullable().comment('ID проекта');

      // table
      //   .foreign('id_project', 'plan_exchange_2_project')
      //   .references('id_project')
      //   .inTable('cf$.project')
      //   .onDelete('cascade');

      table.integer('id_plan').notNullable().comment('ID планируемой операции');

      table.integer('id_account_from').notNullable();

      // table
      //   .foreign(['id_project', 'id_account_from'], 'plan_exchange_2_account_from')
      //   .references(['id_project', 'id_account'])
      //   .inTable('cf$.account')
      //   .onDelete('cascade');

      table.specificType('sum_from', 'numeric').notNullable();

      table.integer('id_money_from').notNullable();

      // table
      //   .foreign(['id_project', 'id_money_from'], 'plan_exchange_2_money_from')
      //   .references(['id_project', 'id_money'])
      //   .inTable('cf$.money')
      //   .onDelete('cascade');

      table.integer('id_account_to').notNullable();

      // table
      //   .foreign(['id_project', 'id_account_to'], 'plan_exchange_2_account_to')
      //   .references(['id_project', 'id_account'])
      //   .inTable('cf$.account')
      //   .onDelete('cascade');

      table.specificType('sum_to', 'numeric').notNullable();

      table.integer('id_money_to').notNullable();

      // table
      //   .foreign(['id_project', 'id_money_to'], 'plan_exchange_2_money_to')
      //   .references(['id_project', 'id_money'])
      //   .inTable('cf$.money')
      //   .onDelete('cascade');

      table.integer('id_account_fee');

      // table
      //   .foreign(['id_project', 'id_account_fee'], 'plan_exchange_2_account_fee')
      //   .references(['id_project', 'id_account'])
      //   .inTable('cf$.account')
      //   .onDelete('cascade');

      table.specificType('fee', 'numeric');

      table.integer('id_money_fee');

      // table
      //   .foreign(['id_project', 'id_money_fee'], 'plan_exchange_2_money_fee')
      //   .references(['id_project', 'id_money'])
      //   .inTable('cf$.money')
      //   .onDelete('cascade');

      table.unique(['id_project', 'id_plan'], 'plan_exchange_id_project_id_plan');
    })
    .raw(
      'alter table cf$.plan_exchange add constraint plan_exchange_fee_check CHECK (((((id_account_fee IS NULL) AND (fee IS NULL)) AND (id_money_fee IS NULL)) OR (((id_account_fee IS NOT NULL) AND (fee IS NOT NULL)) AND (id_money_fee IS NOT NULL))));'
    )
    .raw('alter table cf$.plan_exchange add constraint plan_exchange_money_check CHECK (id_money_from <> id_money_to);')
    .raw(
      'ALTER TABLE ONLY "cf$".plan_exchange ADD CONSTRAINT plan_exchange_2_plan FOREIGN KEY (id_project, id_plan) REFERENCES "cf$".plan(id_project, id_plan) MATCH FULL ON DELETE CASCADE;'
    )

    .raw(plan_exchange_bi_trigger_v1.up);
  await knex.schema.raw(v_plan_exchange_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_plan_exchange_v1.down);
  await knex.schema.dropTable('cf$.plan_exchange');
  await knex.schema.raw(plan_exchange_bi_v1.down);
}
