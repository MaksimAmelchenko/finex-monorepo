import { ILogger } from '../../../types/app';
import { pool } from '../connection';
import { Value } from 'knex';

export async function execute<T>(log: ILogger, sqlText: string, params: readonly Value[]): Promise<T> {
  const start: number = Date.now();
  try {
    const { rows } = await pool.query(sqlText, params as any[]);
    const duration: number = Math.ceil(Date.now() - start);
    log.trace({ duration, db: { sqlText, params } });
    return rows[0];
  } catch (err) {
    log.error({ db: { sqlText, params }, err });
    throw err;
  }
}
