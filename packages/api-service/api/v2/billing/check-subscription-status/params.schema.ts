import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const checkSubscriptionStatusParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    subscriptionId: id,
    locale,
  },
  additionalProperties: false,
  required: ['subscriptionId'],
};
