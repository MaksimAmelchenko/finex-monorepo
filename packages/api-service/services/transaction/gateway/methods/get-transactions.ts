import { IRequestContext } from '../../../../types/app';
import { GetTransactionsGatewayQuery, GetTransactionsGatewayResponse } from '../../types';
import dbRequest from '../../../../libs/db-request';
import { decodeTransaction } from './decode-transaction';

export async function getTransactions(
  ctx: IRequestContext,
  query: GetTransactionsGatewayQuery
): Promise<GetTransactionsGatewayResponse> {
  ctx.log.trace({ query }, 'try to get transactions');

  const { limit, offset, searchText, startDate, endDate, sign, contractors, accounts, categories, tags } = query;
  const { ieDetails, metadata } = await dbRequest(ctx, 'cf.ieDetail.get', {
    limit,
    offset,
    searchText,
    dBegin: startDate,
    dEnd: endDate,
    sign,
    contractors,
    accounts,
    categories,
    tags,
  });

  return {
    metadata,
    transactions: ieDetails.map(decodeTransaction),
  };
}
