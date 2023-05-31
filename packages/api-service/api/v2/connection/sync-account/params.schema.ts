import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const syncAccountParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    connectionId: id,
    connectionAccountId: id,
    locale,
  },
  additionalProperties: false,
  required: ['connectionId', 'connectionAccountId'],
};
