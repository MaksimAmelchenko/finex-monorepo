import { Knex } from 'knex';

import { v_cashflow_detail_v1 } from './cf$/v_cashflow_detail.view/v1';
import { v_cashflow_v1 } from './cf$/v_cashflow.view/v1';
import { v_cashflow_item_v1 } from './cf$/v_cashflow_item.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$_connection').createTable('transaction', table => {
    table.integer('project_id').notNullable();
    table.text('provider_transaction_id').notNullable();
    table.integer('cash_flow_id');
    table.integer('user_id').notNullable();
    table.date('transaction_date').notNullable();
    table.specificType('amount', 'numeric').notNullable();
    table.text('currency').notNullable();
    table.text('transformation_name').notNullable();
    table.specificType('source', 'jsonb').notNullable();
    table.timestamps(true, true);

    table.primary(['project_id', 'provider_transaction_id'], { constraintName: 'transaction_pk' });

    table.foreign('user_id', 'transaction_x_user_fk').references('id_user').inTable('core$.user').onDelete('CASCADE');

    /*
    table
      .foreign(['project_id', 'cash_flow_id'], 'transaction_x_cash_flow_fk')
      .references(['id_project', 'id_cashflow'])
      .inTable('cf$.cashflow')
      .onDelete('NO ACTION');
    */

    table
      .foreign('project_id', 'transaction_x_project_fk')
      .references('id_project')
      .inTable('cf$.project')
      .onDelete('CASCADE');
  });
  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "cf$_connection".transaction TO web');

  await knex.schema.withSchema('cf$_connection').alterTable('account', table => {
    table.datetime('last_synced_at', { useTz: true });
  });

  await knex.schema.raw(v_cashflow_v1.down);
  await knex.schema.raw(v_cashflow_detail_v1.down);
  await knex.schema.raw(v_cashflow_item_v1.down);

  await knex.schema.withSchema('cf$').alterTable('cashflow_detail', table => {
    table.integer('id_category').nullable().alter();

    // delete 'MATCH FULL' constraint
    table.dropForeign(['id_project', 'id_category'], 'cashflow_detail_2_category');

    // and create 'MATCH SIMPLE' constraint
    table
      .foreign(['id_project', 'id_category'], 'cashflow_detail_2_category')
      .references(['id_project', 'id_category'])
      .inTable('cf$.category');
  });

  await knex.schema.raw(v_cashflow_item_v1.up);
  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.v_cashflow_item TO web');

  await knex.schema.raw(v_cashflow_detail_v1.up);
  await knex.schema.raw(v_cashflow_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE cf$_connection.transaction CASCADE');

  await knex.schema.withSchema('cf$_connection').alterTable('account', table => {
    table.dropColumn('last_synced_at');
  });

  await knex.schema.raw(v_cashflow_v1.down);
  await knex.schema.raw(v_cashflow_detail_v1.down);
  await knex.schema.raw(v_cashflow_item_v1.down);

  await knex.schema.withSchema('cf$').alterTable('cashflow_detail', table => {
    table.integer('id_category').notNullable().alter();
    table.dropForeign(['id_project', 'id_category'], 'cashflow_detail_2_category');
  });

  await knex.schema.raw(
    'alter table only "cf$".cashflow_detail add constraint cashflow_detail_2_category foreign key (id_project, id_category) references "cf$".category(id_project, id_category) match full'
  );

  await knex.schema.raw(v_cashflow_item_v1.up);
  await knex.schema.raw(v_cashflow_detail_v1.up);
  await knex.schema.raw(v_cashflow_v1.up);
}
