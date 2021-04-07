import { OpenAPIV3 } from 'openapi-types';
import { categoryId } from '../../../../common/schemas/fields/category-id';

export const createMoneyParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idCurrency: {
      ...categoryId,
      nullable: true,
    },
    isEnabled: {
      type: 'boolean',
      nullable: true,
      default: true,
    },
    name: {
      type: 'string',
    },
    precision: {
      type: 'integer',
    },
    symbol: {
      type: 'string',
    },
    // frontend sends these fields
    idUser: {
      type: 'integer',
      nullable: true,
    },
    idMoney: {
      type: 'integer',
      nullable: true,
    },
    chosen: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
  required: [
    //
    'idCurrency',
    'isEnabled',
    'name',
    'precision',
    'symbol',
  ],
};
