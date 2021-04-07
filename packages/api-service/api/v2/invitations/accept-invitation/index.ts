import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

const acceptInvitation: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/invitations/:idInvitation/accept',
  handler,
};

export default acceptInvitation;
