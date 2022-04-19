import { Knex } from 'knex';
import config from '../libs/config';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`create role web noreplication login password '${config.get('db:connection:password')}'`);
  await knex.schema.raw("create role postman noreplication login password 'UJmStrcmf9HEJoxBLxEY';");
  await knex.schema.raw("create role job noreplication login password 'ZrWwrGXqRehaYlfGgmeH';");
  await knex.schema.raw('CREATE EXTENSION hstore;');
  await knex.schema.raw('CREATE EXTENSION pgcrypto;');
  await knex.schema.raw('CREATE EXTENSION pg_buffercache;');
  await knex.schema.raw('CREATE EXTENSION pg_stat_statements;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('drop role web');
  await knex.schema.raw('drop role postman');
  await knex.schema.raw('drop role job');
  await knex.schema.raw('DROP EXTENSION hstore;');
  await knex.schema.raw('DROP EXTENSION pgcrypto;');
  await knex.schema.raw('DROP EXTENSION pg_buffercache;');
  await knex.schema.raw('DROP EXTENSION pg_stat_statements;');
}
