import { Knex } from 'knex';

import { cashflow_detail_aiud_v1 } from './cf$/cashflow_detail_aiud.function/v1';
import { cashflow_detail_aiud_trigger_v1 } from './cf$/cashflow_detail_aiud.trigger/v1';
import { cashflow_detail_biud_v1 } from './cf$/cashflow_detail_biud.function/v1';
import { cashflow_detail_biud_trigger_v1 } from './cf$/cashflow_detail_biud.trigger/v1';
import { v_cashflow_detail_v1 } from './cf$/v_cashflow_detail.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(cashflow_detail_aiud_v1.up);
  await knex.schema.raw(cashflow_detail_biud_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('cashflow_detail', table => {
      table.comment('Детализация денежного потока на статьи');

      table.integer('id_project').notNullable().comment('ID проекта');

      table
        .foreign('id_project', 'cashflow_detail_2_project')
        .references('id_project')
        .inTable('cf$.project')
        .onDelete('cascade');

      table.bigInteger('id_cashflow').notNullable().comment('ID денежного потока');

      table.specificType('id_cashflow_detail', 'bigserial').notNullable().comment('ID детализации денежного потока');

      table.integer('id_user').notNullable().comment('ID пользователя');

      table
        .foreign('id_user', 'cashflow_detail_2_user')
        .references('id_user')
        .inTable('core$.user')
        .onDelete('cascade');

      table.integer('id_account').notNullable().comment('ID счета');

      table.integer('id_category').notNullable().comment('ID статьи денежного потока');

      table.integer('id_money').notNullable().comment('ID валюты');

      table.integer('id_unit').comment('ID ед.измерения');

      table
        .foreign(['id_project', 'id_unit'], 'cashflow_detail_2_unit')
        .references(['id_project', 'id_unit'])
        .inTable('cf$.unit');

      table
        .specificType('sign', 'smallint')
        .notNullable()
        .comment('Знак направления потока: "-" - расход, "+" - прихода');

      table.date('dcashflow_detail').notNullable().comment('Дата');

      table.date('report_period').notNullable().comment('Отчетный месяц');

      table.specificType('quantity', 'numeric').comment('Количество');

      table.specificType('sum', 'numeric').notNullable().comment('Сумма');

      table.boolean('is_not_confirmed').notNullable().defaultTo(false).comment('Флаг "НЕ подверждённая транзакция"');

      table.text('note').comment('Примечание');

      table.specificType('tags', 'integer[]').comment('ID тегов');

      table.unique(['id_project', 'id_cashflow_detail'], { indexName: 'cashflow_detail_pk' });

      // Дата добавлена для поиск ДП в импорте
      table.index(['id_project', 'id_account'], 'cashflow_detail_id_project_id_account');

      table.index(['id_project', 'id_cashflow'], 'cashflow_detail_id_project_id_cashflow');

      // Для быстрой проверки по внешнему ключу при удалении статьи
      table.index(['id_project', 'id_category'], 'cashflow_detail_id_project_id_category');

      table.index(['id_project', 'id_money'], 'cashflow_detail_id_project_id_money');
    })
    .raw(
      'create index cashflow_detail_id_project_id_account_is_not_confirmed on cf$.cashflow_detail using btree (id_project, id_account) where is_not_confirmed;'
    )
    .raw('create index cashflow_detail_tags on cf$.cashflow_detail  using gin (tags);')
    .raw(
      'alter table cf$.cashflow_detail add constraint cashflow_detail_quantity_check check ((quantity > (0)::numeric));'
    )
    .raw(
      'alter table cf$.cashflow_detail add constraint cashflow_detail_sign_check check ((sign = any (array[(-1), 1])));'
    )
    .raw('alter table cf$.cashflow_detail add constraint cashflow_detail_sum_check check ((sum > (0)::numeric));')
    .raw(
      'alter table only "cf$".cashflow_detail add constraint cashflow_detail_2_account foreign key (id_project, id_account) references "cf$".account(id_project, id_account) match full;'
    )
    .raw(
      'alter table only "cf$".cashflow_detail   add constraint cashflow_detail_2_cashflow foreign key (id_project, id_cashflow) references "cf$".cashflow(id_project, id_cashflow) match full'
    )
    .raw(
      'alter table only "cf$".cashflow_detail add constraint cashflow_detail_2_category foreign key (id_project, id_category) references "cf$".category(id_project, id_category) match full'
    )
    .raw(
      'alter table only "cf$".cashflow_detail add constraint cashflow_detail_2_money foreign key (id_project, id_money) references "cf$".money(id_project, id_money) match full'
    )
    .raw(cashflow_detail_aiud_trigger_v1.up)
    .raw(cashflow_detail_biud_trigger_v1.up);
  await knex.schema.raw(v_cashflow_detail_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_cashflow_detail_v1.down);
  await knex.schema.dropTable('cf$.cashflow_detail');
  await knex.schema.raw(cashflow_detail_aiud_v1.down);
  await knex.schema.raw(cashflow_detail_biud_v1.down);
}
