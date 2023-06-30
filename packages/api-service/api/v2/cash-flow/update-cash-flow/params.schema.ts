import { OpenAPIV3_1 } from 'openapi-types';

import { contractorId } from '../../../../common/schemas/fields/contractor-id';
import { id } from '../../../../common/schemas/fields/id';
import { updateCashFlowItemParamsSchema } from './update-cash-flow-item.params.schema';
import { locale } from '../../../../common/schemas/fields/locale';

export const updateCashFlowParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlowId: id,
    contractorId: {
      ...contractorId,
      type: ['string', 'null'],
    },
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
          // createCashFlowItemParamsSchema,
          updateCashFlowItemParamsSchema,
          // deleteCashFlowItemParamsSchema,
        ],
      },
    },
    locale,
  },
  additionalProperties: false,
  required: ['cashFlowId'],
};
