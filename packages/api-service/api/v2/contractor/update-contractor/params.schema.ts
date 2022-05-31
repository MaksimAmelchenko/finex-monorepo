import { OpenAPIV3 } from 'openapi-types';

import { contractorId } from '../../../../common/schemas/fields/contractor-id';

export const updateContractorParamsSchema: OpenAPIV3.SchemaObject = {
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
