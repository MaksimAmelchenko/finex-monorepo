import { OpenAPIV3_1 } from 'openapi-types';
import { ieDetailSchema } from '../ie-detail.schema';
import { tagSchema } from '../../../../common/schemas/tag.schema';

export const updateIeDetailResponseSchema: OpenAPIV3_1.SchemaObject = {
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
