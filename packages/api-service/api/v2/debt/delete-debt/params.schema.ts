import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { locale } from '../../../../common/schemas/fields/locale';

export const deleteDebtParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    debtId: id,
    locale,
  },
  additionalProperties: false,
  required: ['debtId'],
};
