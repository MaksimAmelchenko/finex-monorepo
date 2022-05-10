import { OpenAPIV3 } from 'openapi-types';

import { idIEDetail } from '../../../../common/schemas/fields/id-ie-detail';

export const deleteIeDetailParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idIEDetail,
  },
  additionalProperties: false,
  required: ['idIEDetail'],
};
