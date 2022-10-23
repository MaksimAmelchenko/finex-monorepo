import { OpenAPIV3_1 } from 'openapi-types';

import { moneySchema } from '../../../../common/schemas/money.schema';

export const moneysSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: moneySchema,
};
