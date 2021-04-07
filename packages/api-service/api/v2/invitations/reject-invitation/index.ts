import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

// import paramsSchema from './params.schema';
// import responseSchema from './response.schema';

const rejectInvitation: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v1/invitations/:idInvitation/reject',
  handler,
  schemas: {
    // params: paramsSchema,
    // response: responseSchema,
  },
};

export default rejectInvitation;
