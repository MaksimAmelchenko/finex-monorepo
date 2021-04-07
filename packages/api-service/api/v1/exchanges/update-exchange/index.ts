import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const updateExchange: RestRouteOptions = {
  methods: [RestMethod.Post, RestMethod.Patch],
  uri: '/v1/cashflows/exchanges/:idExchange',
  handler,
};
