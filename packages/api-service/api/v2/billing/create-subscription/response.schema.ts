import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';

export const createSubscriptionResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    subscriptionId: id,
    paymentConfirmationToken: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['subscriptionId'],
};
