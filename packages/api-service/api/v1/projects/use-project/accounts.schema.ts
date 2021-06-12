import { OpenAPIV3 } from 'openapi-types';
import { accountSchema } from '../../../../common/schemas/account.schema';

export const accountsSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: accountSchema,
};
