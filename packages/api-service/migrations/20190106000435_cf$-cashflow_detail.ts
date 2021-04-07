import * as Knex from 'knex';

import { cashflow_detail_aiud_v1 } from './cf$/cashflow_detail_aiud.function/v1';
import { cashflow_detail_aiud_trigger_v1 } from './cf$/cashflow_detail_aiud.trigger/v1';
import { cashflow_detail_biud_v1 } from './cf$/cashflow_detail_biud.function/v1';
import { cashflow_detail_biud_trigger_v1 } from './cf$/cashflow_detail_biud.trigger/v1';
import { v_cashflow_detail_v1 } from './cf$/v_cashflow_detail.view/v1';

// tslint:disable:max-line-length

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

      table.unique(['id_project', 'id_cashflow_detail'], 'cashflow_detail_pk');

      // Дата добавлена для поиск ДП в импорте
      table.index(['id_project', 'id_account'], 'cashflow_detail_id_project_id_account');

      table.index(['id_project', 'id_cashflow'], 'cashflow_detail_id_project_id_cashflow');

      // Для быстрой проверки по внешнему ключу при удалении статьи
      table.index(['id_project', 'id_category'], 'cashflow_detail_id_project_id_category');

      table.index(['id_project', 'id_money'], 'cashflow_detail_id_project_id_money');
    })
    .raw(
      'CREATE INDEX cashflow_detail_id_project_id_account_is_not_confirmed ON cf$.cashflow_detail USING btree (id_project, id_account) WHERE is_not_confirmed;'
    )
    .raw('CREATE INDEX cashflow_detail_tags ON cf$.cashflow_detail  USING gin (tags);')
    .raw(
      'alter table cf$.cashflow_detail add constraint cashflow_detail_quantity_check CHECK ((quantity > (0)::numeric));'
    )
    .raw(
      'alter table cf$.cashflow_detail add constraint cashflow_detail_sign_check CHECK ((sign = ANY (ARRAY[(-1), 1])));'
    )
    .raw('alter table cf$.cashflow_detail add constraint cashflow_detail_sum_check CHECK ((sum > (0)::numeric));')
    .raw(
      'ALTER TABLE ONLY "cf$".cashflow_detail ADD CONSTRAINT cashflow_detail_2_account FOREIGN KEY (id_project, id_account) REFERENCES "cf$".account(id_project, id_account) MATCH FULL;'
    )
    .raw(
      'ALTER TABLE ONLY "cf$".cashflow_detail   ADD CONSTRAINT cashflow_detail_2_cashflow FOREIGN KEY (id_project, id_cashflow) REFERENCES "cf$".cashflow(id_project, id_cashflow) MATCH FULL'
    )
    .raw(
      'ALTER TABLE ONLY "cf$".cashflow_detail ADD CONSTRAINT cashflow_detail_2_category FOREIGN KEY (id_project, id_category) REFERENCES "cf$".category(id_project, id_category) MATCH FULL'
    )
    .raw(
      'ALTER TABLE ONLY "cf$".cashflow_detail ADD CONSTRAINT cashflow_detail_2_money FOREIGN KEY (id_project, id_money) REFERENCES "cf$".money(id_project, id_money) MATCH FULL'
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
