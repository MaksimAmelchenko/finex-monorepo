import { Knex } from 'knex';

import { money_bi_v1 } from './cf$/money_bi.function/v1';
import { money_bi_trigger_v1 } from './cf$/money_bi.trigger/v1';
import { v_money_v1 } from './cf$/v_money.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(money_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('money', table => {
      table.comment('Деньги');

      table.integer('id_project').notNullable().comment('ID проекта');

      table
        .foreign('id_project', 'money_2_project')
        .references('id_project')
        .inTable('cf$.project')
        .onDelete('cascade');

      table.specificType('id_money', 'serial').notNullable().comment('ID денги');

      table.integer('id_user').notNullable().comment('ID пользователя');

      table.foreign('id_user', 'money_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table.integer('id_currency').comment('ID валюты, если используем стандартную валюту');

      table.foreign('id_currency', 'money_2_currency').references('id_currency').inTable('cf$.currency');

      table.text('name').notNullable().comment('Наименование, если не используется стандартная валюта');
      table.text('symbol');

      table.boolean('is_enabled').notNullable().defaultTo(true).comment('Флаг "Доступная"');

      table.specificType('sorting', 'smallint').comment('Порядок сортировки валюты в списке');

      table.integer('precision').defaultTo(2);

      table.primary(['id_project', 'id_money'], { constraintName: 'money_pk' });
    })
    .raw("alter table cf$.money add constraint money_name_is_empty CHECK (btrim(name) <> ''::text);")
    .raw('alter table cf$.money add constraint money_name_is_too_long CHECK (length(name) <= 50);')
    .raw('alter table cf$.money add constraint money_symbol_is_too_long CHECK (length(symbol) <= 10);')
    .raw('CREATE UNIQUE INDEX money_id_project_name_u ON cf$.money USING btree (id_project, (upper(name)));')
    .raw(money_bi_trigger_v1.up);
  await knex.schema.raw(v_money_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_money_v1.down);
  await knex.schema.dropTable('cf$.money');
  await knex.schema.raw(money_bi_v1.down);
}
