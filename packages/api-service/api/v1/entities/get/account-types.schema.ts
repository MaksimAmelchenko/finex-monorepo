import { OpenAPIV3 } from 'openapi-types';
import { accountTypeSchema } from '../../../../common/schemas/account-type.schema';

export const accountsTypeSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: accountTypeSchema,
};
