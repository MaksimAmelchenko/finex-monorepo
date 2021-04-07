import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteIe: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/cashflows/ies/:idIE',
  handler,
};
