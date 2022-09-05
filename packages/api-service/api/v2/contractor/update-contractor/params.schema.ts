import { OpenAPIV3_1 } from 'openapi-types';

import { contractorId } from '../../../../common/schemas/fields/contractor-id';

export const updateContractorParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    contractorId,
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['contractorId'],
};
