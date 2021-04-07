import * as Knex from 'knex';

import { plan_exclude_period_bi_v1 } from './cf$/plan_exclude_period_bi.function/v1';
import { plan_exclude_period_bi_trigger_v1 } from './cf$/plan_exclude_period_bi.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(plan_exclude_period_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('plan_exclude_period', table => {
      table.comment('Исключенный из планирования период');
      table.integer('id_project').notNullable().comment('ID проекта');

      // table
      //   .foreign('id_project', 'plan_exclude_period_2_project')
      //   .references('id_project')
      //   .inTable('cf$.project')
      //   .onDelete('cascade');

      table.integer('id_plan').notNullable().comment('ID планируемой операции');

      table.date('dbegin').notNullable().comment('Дата начала');
      table.date('dend').notNullable().comment('Дата окончания');

      table.index(['id_project', 'id_plan'], 'plan_exclude_period_id_project_id_plan');
    })
    .raw(
      'ALTER TABLE ONLY "cf$".plan_exclude_period ADD CONSTRAINT plan_exclude_period_2_plan FOREIGN KEY (id_project, id_plan) REFERENCES "cf$".plan(id_project, id_plan) MATCH FULL ON DELETE CASCADE;'
    )
    .raw(plan_exclude_period_bi_trigger_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.plan_exclude_period');
  await knex.schema.raw(plan_exclude_period_bi_v1.down);
}
