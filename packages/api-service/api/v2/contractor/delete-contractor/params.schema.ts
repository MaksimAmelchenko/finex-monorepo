import { OpenAPIV3_1 } from 'openapi-types';

import { contractorId } from '../../../../common/schemas/fields/contractor-id';

export const deleteContractorParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    contractorId,
  },
  additionalProperties: false,
  required: ['contractorId'],
};
