import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';
import { moneyId } from '../../../../common/schemas/fields/money-id';

export const sortMoneysParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    moneyIds: {
      type: 'array',
      items: moneyId,
    },
    locale,
  },
  additionalProperties: false,
  required: ['moneyIds'],
};
