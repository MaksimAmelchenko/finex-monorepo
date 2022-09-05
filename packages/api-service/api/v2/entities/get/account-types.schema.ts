import { OpenAPIV3_1 } from 'openapi-types';

import { accountTypeSchema } from '../../account-type/account-type.schema';

export const accountsTypeSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: accountTypeSchema,
};
