import { query } from './methods/query';
import { Knex, knex as knexInstance } from 'knex';
import { execute } from './methods/execute';
import { pool } from './connection';

const knex: Knex = knexInstance({
  client: 'pg',
});

const DB = {
  pool,
  execute,
  query,
};

export { DB, knex };
