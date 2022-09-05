import { OpenAPIV3_1 } from 'openapi-types';
import { tagSchema } from '../../tag/tag.schema';

export const tagsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: tagSchema,
};
