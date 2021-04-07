import * as Knex from 'knex';

import { cashflow_bi_v1 } from './cf$/cashflow_bi.function/v1';
import { cashflow_bi_trigger_v1 } from './cf$/cashflow_bi.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(cashflow_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('cashflow', table => {
      table.comment('Денежный поток. Приходы денежных средств, расходы, долги');

      table.integer('id_project').notNullable().comment('ID проекта');

      table
        .foreign('id_project', 'cashflow_2_project')
        .references('id_project')
        .inTable('cf$.project')
        .onDelete('cascade');

      table.specificType('id_cashflow', 'bigserial').notNullable().comment('ID денежного потока');

      table.integer('id_user').notNullable().comment('ID пользователя');

      table.foreign('id_user', 'cashflow_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table
        .specificType('id_cashflow_type', 'smallint')
        .notNullable()
        .comment('1 - Income \\\\\\\\ Expense, 2- Debt, 3 - Transfer, 4 - Exchange (for increasing speed of query)');

      table
        .integer('id_contractor')
        // .notNullable()
        .comment('ID контрагента');

      table
        .foreign(['id_project', 'id_contractor'], 'cashflow_2_contractor')
        .references(['id_project', 'id_contractor'])
        .inTable('cf$.contractor');

      table.text('note').comment('Примечание');

      table.specificType('tags', 'integer[]').comment('IDs тегов');

      table.timestamp('dset').notNullable().comment('Дата создания записи');

      table.primary(['id_project', 'id_cashflow'], 'cashflow_pk');
      table.index(['id_project', 'id_cashflow_type'], 'cashflow_id_project_id_cashflow_type');
      table.index(['id_project', 'id_contractor'], 'cashflow_id_project_id_contractor');
    })
    .raw(`CREATE INDEX cashflow_tags ON cf$.cashflow USING gin (tags);`)
    .raw(cashflow_bi_trigger_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.cashflow');
  await knex.schema.raw(cashflow_bi_v1.down);
}
