import { OpenAPIV3_1 } from 'openapi-types';

import { badgeSchema } from '../../../../common/schemas/badge.schema';

export const badgesSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: badgeSchema,
};
