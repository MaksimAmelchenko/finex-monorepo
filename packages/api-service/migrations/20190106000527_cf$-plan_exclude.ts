import * as Knex from 'knex';

import { plan_exclude_bi_v1 } from './cf$/plan_exclude_bi.function/v1';
import { plan_exclude_bi_trigger_v1 } from './cf$/plan_exclude_bi.trigger/v1';
import { v_plan_exclude_v1 } from './cf$/v_plan_exclude.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(plan_exclude_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('plan_exclude', table => {
      table.comment('Дата, которая исключена из плана по причине принятия или отмены планируемой операции');

      table.integer('id_project').notNullable().comment('ID проекта');

      // table
      //   .foreign('id_project', 'plan_exclude_2_project')
      //   .references('id_project')
      //   .inTable('cf$.project')
      //   .onDelete('cascade');

      table.integer('id_plan').notNullable().comment('ID плана');

      table
        .integer('id_user')
        // .notNullable()
        .comment('ID пользователя');

      // table
      //   .foreign('id_user', 'plan_exclude_2_user')
      //   .references('id_user')
      //   .inTable('core$.user')
      //   .onDelete('cascade');

      table.date('dexclude').notNullable().comment('Дата исключения');

      table
        .specificType('action_type', 'smallint')
        .notNullable()
        .comment('1 - планируемая операция внесена\n 2 - отмена');

      table.index(['id_project', 'id_plan'], 'plan_exclude_id_project_id_plan');
    })
    .raw(
      'ALTER TABLE ONLY "cf$".plan_exclude  ADD CONSTRAINT plan_exclude_2_plan FOREIGN KEY (id_project, id_plan) REFERENCES "cf$".plan(id_project, id_plan) MATCH FULL ON DELETE CASCADE;'
    )
    .raw(plan_exclude_bi_trigger_v1.up);
  await knex.schema.raw(v_plan_exclude_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_plan_exclude_v1.down);
  await knex.schema.dropTable('cf$.plan_exclude');
  await knex.schema.raw(plan_exclude_bi_v1.down);
}
