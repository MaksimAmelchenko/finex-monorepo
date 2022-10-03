/**
 * Get the last email for recipient
 * @param {IRequestContext} ctx
 * @param {string} recipient recipient email
 * @param {period} period in seconds for finding email
 */
import * as moment from 'moment';

import { IRequestContext } from '../../types/app';
import { knex } from '../../knex';

export async function getLastTransactionalEmail(
  ctx: IRequestContext<never, false>,
  recipient: string,
  period = 30
): Promise<any> {
  const emails = await knex
    .select('*')
    .from('core$.transactional_email')
    .where(knex.raw('email = ?', [recipient]))
    .orderBy('created_at', 'desc')
    .limit(1);

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
