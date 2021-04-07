import * as Knex from 'knex';
import config from './libs/config';
import * as pg from 'pg';

// https://github.com/brianc/node-postgres/pull/353#issuecomment-283709264
// bigint
pg.types.setTypeParser(20, parseInt);

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
  return parseFloat(value);
});
// Initialize knex
export const knex = Knex({
  ...config.get('db'),
});
