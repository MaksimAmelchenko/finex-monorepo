import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

export const copyProject: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/projects/:idProject/copy',
  handler,
};
