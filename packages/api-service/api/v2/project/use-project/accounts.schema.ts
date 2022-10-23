import { OpenAPIV3_1 } from 'openapi-types';

import { accountSchema } from '../../account/account.schema';

export const accountsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: accountSchema,
};
