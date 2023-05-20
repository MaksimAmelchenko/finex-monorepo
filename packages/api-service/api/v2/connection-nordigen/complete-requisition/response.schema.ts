import { OpenAPIV3_1 } from 'openapi-types';
import { id } from '../../../../common/schemas/fields/id';

export const completeRequisitionResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    connectionId: id,
  },
  additionalProperties: false,
  required: [
    //
    'connectionId',
  ],
};
