import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const mergeProject: RestRouteOptions = {
  method: RestMethod.Put,
  uri: '/v1/projects/:idProject/merge',
  handler,
};
