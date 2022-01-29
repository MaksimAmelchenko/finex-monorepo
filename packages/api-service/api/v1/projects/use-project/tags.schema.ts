import { OpenAPIV3 } from 'openapi-types';
import { tagSchema } from '../../../../common/schemas/tag.schema';

export const tagsSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: tagSchema,
};
