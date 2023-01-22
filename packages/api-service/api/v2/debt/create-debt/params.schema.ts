import { OpenAPIV3_1 } from 'openapi-types';

import { contractorId } from '../../../../common/schemas/fields/contractor-id';
import { createDebtItemParamsSchema } from '../create-debt-item.params.schema';
import { locale } from '../../../../common/schemas/fields/locale';

export const createDebtParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    contractorId,
    note: {
      type: 'string',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    items: {
      type: 'array',
      items: createDebtItemParamsSchema,
    },
    locale,
  },
  additionalProperties: false,
  required: ['contractorId'],
};
