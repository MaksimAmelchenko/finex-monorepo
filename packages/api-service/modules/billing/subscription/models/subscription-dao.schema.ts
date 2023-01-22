import { OpenAPIV3_1 } from 'openapi-types';

import { SubscriptionStatus } from '../types';
import { dateTime } from '../../../../common/schemas/fields/date-time';

export const subscriptionDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
    userId: {
      type: 'integer',
    },
    status: {
      type: 'string',
      enum: [
        //
        SubscriptionStatus.Pending,
        SubscriptionStatus.Active,
        SubscriptionStatus.Canceled,
      ],
    },
    planId: {
      type: 'string',
    },
    gateway: {
      type: ['string', 'null'],
      enum: ['yookassa', 'paypal'],
    },
    gatewaySubscriptionId: {
      type: ['string', 'null'],
    },
    gatewayMetadata: {
      type: ['object', 'null'],
    },
    createdAt: dateTime,
    updatedAt: dateTime,
  },
  additionalProperties: false,
  required: [
    //
    'id',
    'userId',
    'status',
    'planId',
  ],
};
