import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const getIe: RestRouteOptions = {
  method: RestMethod.Get,
  uri: '/v1/cashflows/ies/:idIE',
  handler,
};
