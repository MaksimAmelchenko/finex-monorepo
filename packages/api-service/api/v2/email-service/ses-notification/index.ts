import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';

import { sesNotificationParamsSchema } from './params.schema';
import { sesNotificationResponseSchema } from './response.schema';

export const sesNotification: RestRouteOptions = {
  method: RestMethod.Post,
  uri: '/v2/ses_notification',
  handler,
  schemas: {
    params: sesNotificationParamsSchema,
    response: sesNotificationResponseSchema,
  },
  isNeedAuthorization: false,
};
