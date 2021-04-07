import { OpenAPIV3 } from 'openapi-types';
import { ieDetailSchema } from '../ie-detail.schema';

export const getIeDetailResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    ieDetail: ieDetailSchema,
  },
  additionalProperties: false,
  required: ['ieDetail'],
};
