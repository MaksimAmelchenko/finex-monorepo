import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { handler } from './handler';
import { syncAllAccountsParamsSchema } from './params.schema';

export const syncAllAccounts: RestRouteOptions = {
  methods: [RestMethod.Get, RestMethod.Post],
  uri: '/v1/connections/accounts/sync',
  handler,
  schemas: {
    params: syncAllAccountsParamsSchema,
  },
  isNeedAuthorization: false,
};
