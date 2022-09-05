import { OpenAPIV3_1 } from 'openapi-types';
import { currencyId } from '../../../common/schemas/fields/currency-id';

export const currencySchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: currencyId,
    name: {
      type: 'string',
      example: 'Доллар США',
    },
    shortName: {
      type: 'string',
      example: 'дол',
    },
    symbol: {
      type: 'string',
      example: '$',
    },
    code: {
      type: 'string',
      example: 'USD',
    },
  },
  additionalProperties: false,
  required: ['id', 'name', 'shortName', 'symbol', 'code'],
};
