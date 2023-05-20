import * as pg from 'pg';
import { Knex, knex as knexInstance } from 'knex';
import { format, parseISO } from 'date-fns';
import { knexSnakeCaseMappers } from 'objection';

import config from './libs/config';

// https://github.com/brianc/node-postgres/pull/353#issuecomment-283709264
// bigint
pg.types.setTypeParser(pg.types.builtins.INT8, parseInt);
pg.types.setTypeParser(pg.types.builtins.NUMERIC, parseFloat);

pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, (value: string) => parseISO(value).toISOString());
pg.types.setTypeParser(pg.types.builtins.DATE, (value: string) => format(parseISO(value), 'yyyy-MM-dd'));

// Initialize knex
export const knex: Knex = knexInstance({
  ...config.get('db'),
  ...knexSnakeCaseMappers(),
});
