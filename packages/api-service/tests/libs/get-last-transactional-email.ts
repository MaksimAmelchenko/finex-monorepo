/**
 * Get the last email for recipient
 * @param {App.ILogger} log
 * @param {string} recipient recipient email
 * @param {period} period in seconds for finding email
 */
import createRequestContext from '../../libs/create-request-context';
import { DB, knex } from '../../libs/db';
import * as moment from 'moment';

export async function getLastTransactionalEmail(log, recipient: string, period = 30): Promise<any> {
  const ctx = createRequestContext();

  const query = knex
    .select('*')
    .from('core$.transactional_email')
    .where(knex.raw('email = ?', [recipient]))
    .orderBy('created_at', 'desc')
    .limit(1)
    .toSQL()
    .toNative();

  const emails: any[] = await DB.query(ctx.log, query.sql, query.bindings);

  if (!emails.length) {
    throw new Error('There are no messages');
  }
  const [{ message }] = emails;

  const age: number = moment.utc().diff(moment.utc(message.createdAt), 'seconds');
  if (age > period) {
    throw new Error(`There is no timely message for ${recipient}. The last one was ${age} sec ago`);
  }
  return JSON.parse(message);
}
