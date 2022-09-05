import { OpenAPIV3_1 } from 'openapi-types';
import { ieDetailSchema } from '../ie-detail.schema';

export const getIeDetailResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    ieDetail: ieDetailSchema,
  },
  additionalProperties: false,
  required: ['ieDetail'],
};
