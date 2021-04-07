import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const useProject: RestRouteOptions = {
  method: RestMethod.Put,
  uri: '/v1/projects/:idProject/use',
  handler,
};
