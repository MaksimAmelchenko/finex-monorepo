import * as Knex from 'knex';

import { plan_transfer_bi_v1 } from './cf$/plan_transfer_bi.function/v1';
import { plan_transfer_bi_trigger_v1 } from './cf$/plan_transfer_bi.trigger/v1';
import { v_plan_transfer_v1 } from './cf$/v_plan_transfer.view/v1';

// tslint:disable:max-line-length

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(plan_transfer_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('plan_transfer', table => {
      table.integer('id_project').notNullable().comment('ID проекта');

      // table
      //   .foreign('id_project', 'plan_transfer_2_project')
      //   .references('id_project')
      //   .inTable('cf$.project')
      //   .onDelete('cascade');

      table.integer('id_plan').notNullable().comment('ID планируемой операции');

      table.integer('id_account_from').notNullable().comment('ID счета, с которого делается перевод');

      // table
      //   .foreign(['id_project', 'id_account_from'], 'plan_transfer_2_account_from')
      //   .references(['id_project', 'id_account'])
      //   .inTable('cf$.account')
      //   .onDelete('cascade');

      table.integer('id_account_to').notNullable().comment('ID счета, на который переводятся средства');

      // table
      //   .foreign(['id_project', 'id_account_to'], 'plan_transfer_2_account_to')
      //   .references(['id_project', 'id_account'])
      //   .inTable('cf$.account')
      //   .onDelete('cascade');

      table.specificType('sum', 'numeric').notNullable().comment('Сумма перевода');

      table.integer('id_money').notNullable().comment('ID деньги');

      // table
      //   .foreign(['id_project', 'id_money'], 'plan_transfer_2_money_from')
      //   .references(['id_project', 'id_money'])
      //   .inTable('cf$.money')
      //   .onDelete('cascade');

      table.integer('id_account_fee').comment('ID счета, с которого списали комиссию');
      // table
      //   .foreign(['id_project', 'id_account_fee'], 'plan_transfer_2_account_fee')
      //   .references(['id_project', 'id_account'])
      //   .inTable('cf$.account')
      //   .onDelete('cascade');

      table.specificType('fee', 'numeric').comment('Сумма комиссии');

      table.integer('id_money_fee').comment('ID валюты комиссии');

      // table
      //   .foreign(['id_project', 'id_money_fee'], 'plan_transfer_2_money_fee')
      //   .references(['id_project', 'id_money'])
      //   .inTable('cf$.money')
      //   .onDelete('cascade');

      table.unique(['id_project', 'id_plan'], 'plan_transfer_id_project_id_plan');
    })
    .raw(
      'alter table cf$.plan_transfer add constraint plan_transfer_account_check CHECK (id_account_from <> id_account_to);'
    )
    .raw(
      'alter table cf$.plan_transfer add constraint plan_transfer_fee_check CHECK ((((id_account_fee IS NULL) AND (fee IS NULL)) AND (id_money_fee IS NULL)) OR (((id_account_fee IS NOT NULL) AND (fee IS NOT NULL)) AND (id_money_fee IS NOT NULL)));'
    )
    .raw(
      'ALTER TABLE ONLY "cf$".plan_transfer ADD CONSTRAINT plan_transfer_2_plan FOREIGN KEY (id_project, id_plan) REFERENCES "cf$".plan(id_project, id_plan) MATCH FULL ON DELETE CASCADE;\n'
    )
    .raw(plan_transfer_bi_trigger_v1.up);
  await knex.schema.raw(v_plan_transfer_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_plan_transfer_v1.down);
  await knex.schema.dropTable('cf$.plan_transfer');
  await knex.schema.raw(plan_transfer_bi_v1.down);
}
