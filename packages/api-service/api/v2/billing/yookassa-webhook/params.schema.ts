import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';

export const paymentParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['notification'],
    },
    event: {
      type: 'string',
      enum: ['payment.succeeded', 'payment.waiting_for_capture', 'payment.canceled', 'refund.succeeded'],
    },
    object: {
      type: 'object',
    },
    locale,
  },
  additionalProperties: false,
  required: ['type', 'event', 'object'],
};
