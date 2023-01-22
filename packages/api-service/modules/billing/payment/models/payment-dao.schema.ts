import { OpenAPIV3_1 } from 'openapi-types';

import { dateTime } from '../../../../common/schemas/fields/date-time';

export const paymentDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
    userId: {
      type: 'number',
    },
    status: {
      type: 'string',
      enum: [
        //
        'waiting_for_capture',
        'pending',
        'succeeded',
        'canceled',
      ],
    },
    initiator: {
      type: 'string',
      enum: ['user', 'subscription'],
    },
    subscriptionId: {
      type: ['string', 'null'],
      format: 'uuid',
    },
    planId: {
      type: 'string',
    },
    amount: {
      type: 'number',
    },
    currency: {
      type: 'string',
    },
    startAt: dateTime,
    endAt: dateTime,
    gateway: {
      type: 'string',
    },
    gatewayPaymentId: {
      type: ['string', 'null'],
    },
    gatewayResponses: {
      type: 'array',
      items: {
        type: 'object',
      },
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
    'initiator',
    'planId',
    'amount',
    'currency',
    'gateway',
    // 'gatewayPaymentId',
    'gatewayResponses',
  ],
};
