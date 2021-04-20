import * as Knex from 'knex';

import { plan_aiu_v1 } from './cf$/plan_aiu.function/v1';
import { plan_aiu_trigger_v1 } from './cf$/plan_aiu.trigger/v1';
import { plan_bi_v1 } from './cf$/plan_bi.function/v1';
import { plan_bi_trigger_v1 } from './cf$/plan_bi.trigger/v1';
import { v_plan_v1 } from './cf$/v_plan.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(plan_aiu_v1.up);
  await knex.schema.raw(plan_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('plan', table => {
      table.comment('Планируемая операция');

      table.integer('id_project').notNullable().comment('ID проекта');

      // table
      //   .foreign('id_project', 'plan_2_project')
      //   .references('id_project')
      //   .inTable('cf$.project')
      //   .onDelete('cascade');

      table.specificType('id_plan', 'serial').notNullable().comment('ID планируемой операции');

      table.integer('id_user').notNullable().comment('ID пользователя');

      // table
      //   .foreign('id_user', 'plan_2_user')
      //   .references('id_user')
      //   .inTable('core$.user')
      //   .onDelete('cascade');

      table.date('dbegin').notNullable().comment('Дата начала планирования');

      table.date('report_period').notNullable().comment('Отчетный месяц');

      table.text('operation_note').comment('Примечание операции');

      table.specificType('operation_tags', 'integer[]').comment('IDs тегов операции');

      table
        .integer('repeat_type')
        .comment(
          `0 - не повторять\n 1 - недельное планирование\n 2 - месячное планирование \n 3 - ежеквартальное планирование\n 4-  ежегодно`
        );
      table
        .specificType('repeat_days', 'integer[]')
        .comment(
          'В какие дни повторять, для "недельного" планирования - дни недели (1..7), для "месячного" - число (1..31)'
        );

      table
        .specificType('end_type', 'smallint')
        .comment('Когда закончить. 0 - никогда, 1 - после указанного кол-ва раз, 2 - в указанную дату');

      table.specificType('repeat_count', 'smallint').comment('Количество повторений');

      table.date('dend').comment('Дата окончания планирования');
      table.text('color_mark').comment('Цветовая метка');
      table.text('note').comment('Примечание');

      table.primary(['id_project', 'id_plan'], 'plan_pk');
    })
    .raw(plan_aiu_trigger_v1.up)
    .raw(plan_bi_trigger_v1.up);
  await knex.schema.raw(v_plan_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_plan_v1.down);
  await knex.schema.dropTable('cf$.plan');
  await knex.schema.raw(plan_aiu_v1.down);
  await knex.schema.raw(plan_bi_v1.down);
}
