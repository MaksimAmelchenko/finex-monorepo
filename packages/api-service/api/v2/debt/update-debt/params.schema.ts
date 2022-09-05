import { OpenAPIV3_1 } from 'openapi-types';

import { contractorId } from '../../../../common/schemas/fields/contractor-id';
import { createDebtItemParamsSchema } from '../create-debt-item.params.schema';
import { deleteDebtItemParamsSchema } from './delete-debt-item.params.schema';
import { id } from '../../../../common/schemas/fields/id';
import { updateDebtItemParamsSchema } from './update-debt-item.params.schema';

export const updateDebtParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    debtId: id,
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
      items: {
        oneOf: [
          //
          // createDebtItemParamsSchema,
          updateDebtItemParamsSchema,
          // deleteDebtItemParamsSchema,
        ],
      },
    },
  },
  additionalProperties: false,
  required: ['debtId'],
};
