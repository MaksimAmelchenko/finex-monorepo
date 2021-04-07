import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const deleteTag: RestRouteOptions = {
  method: RestMethod.Delete,
  uri: '/v1/tags/:idTag',
  handler,
};
