import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';

export const createRequisitionParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    institutionId: {
      type: 'string',
    },
    locale,
  },
  additionalProperties: false,
  required: ['institutionId'],
};
