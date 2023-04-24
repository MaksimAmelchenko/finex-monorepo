import { OpenAPIV3_1 } from 'openapi-types';

import { i18n } from '../../../common/schemas/fields/i18n';
import { id } from '../../../common/schemas/fields/id';

export const currencyDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    code: id,
    name: i18n({ type: 'string' }),
    precision: {
      type: 'number',
    },
    symbol: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: [
    //
    'code',
    'name',
    'precision',
    'symbol',
  ],
};
