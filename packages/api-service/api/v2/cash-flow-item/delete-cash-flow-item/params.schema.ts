import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const deleteCashFlowItemParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    cashFlowId: id,
    cashFlowItemId: id,
    locale,
  },
  additionalProperties: false,
  required: ['cashFlowItemId'],
};
