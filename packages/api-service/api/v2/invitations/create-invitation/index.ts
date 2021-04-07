import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

const createInvitation: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/invitations',
  handler,
};

export default createInvitation;
