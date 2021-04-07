import * as pg from 'pg';
import config from '../config';

// https://github.com/brianc/node-postgres/pull/353#issuecomment-283709264
// bigint
pg.types.setTypeParser(20, parseInt);

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
  return parseFloat(value);
});

const pool = new pg.Pool({
  ...config.get('db').connection,
});

export { pool };
