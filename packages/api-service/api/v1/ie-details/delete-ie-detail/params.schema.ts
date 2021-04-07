import { OpenAPIV3 } from 'openapi-types';
import { ieDetailId } from '../../../../common/schemas/fields/ie-detail-id';

export const deleteIeDetailParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idIEDetail: ieDetailId,
  },
  additionalProperties: false,
  required: ['idIEDetail'],
};
