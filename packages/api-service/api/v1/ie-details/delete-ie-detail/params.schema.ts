import { OpenAPIV3_1 } from 'openapi-types';

import { idIEDetail } from '../../../../common/schemas/fields/id-ie-detail';

export const deleteIeDetailParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idIEDetail,
  },
  additionalProperties: false,
  required: ['idIEDetail'],
};
