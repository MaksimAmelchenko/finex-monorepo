import { query } from './methods/query';
import * as Knex from 'knex';
import { execute } from './methods/execute';
import { pool } from './connection';

const knex: Knex = Knex({
  client: 'pg',
});

const DB = {
  pool,
  execute,
  query,
};

export { DB, knex };
