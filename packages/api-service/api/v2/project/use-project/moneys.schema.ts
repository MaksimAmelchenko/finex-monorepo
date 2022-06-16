import { OpenAPIV3 } from 'openapi-types';

import { moneySchema } from '../../money/money.schema';

export const moneysSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: moneySchema,
};
