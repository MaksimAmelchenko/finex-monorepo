import { OpenAPIV3 } from 'openapi-types';
import { badgeSchema } from '../../../../common/schemas/badge.schema';

export const badgesSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: badgeSchema,
};
