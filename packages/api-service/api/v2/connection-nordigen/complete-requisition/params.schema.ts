import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';

export const completeRequisitionParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    requisitionId: {
      type: 'string',
    },
    locale,
  },
  additionalProperties: false,
  required: ['requisitionId'],
};
