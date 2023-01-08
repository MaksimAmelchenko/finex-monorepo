import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const getExchangeParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    exchangeId: id,
    locale,
  },
  additionalProperties: false,
  required: ['exchangeId'],
};
