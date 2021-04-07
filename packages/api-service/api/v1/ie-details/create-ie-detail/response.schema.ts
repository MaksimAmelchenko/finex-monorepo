import { OpenAPIV3 } from 'openapi-types';
import { ieDetailSchema } from '../ie-detail.schema';
import { tagSchema } from '../../../../common/schemas/tag.schema';

export const createIeDetailResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    ieDetail: ieDetailSchema,
    newTags: {
      type: 'array',
      items: tagSchema,
    },
  },
  additionalProperties: false,
  required: ['ieDetail'],
};
