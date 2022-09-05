import { OpenAPIV3_1 } from 'openapi-types';
import { date } from '../../../../common/schemas/fields/date';
import { emptyString } from '../../../../common/schemas/fields/empty-string';
import { sign } from '../../../../common/schemas/fields/sign';

export const getIeDetailsParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    limit: {
      type: 'integer',
      minimum: 0,
      default: 50,
    },
    offset: {
      type: 'integer',
      minimum: 0,
      default: 0,
    },
    searchText: {
      type: 'string',
    },
    dBegin: {
      oneOf: [date, emptyString],
    },
    dEnd: {
      oneOf: [date, emptyString],
    },
    sign: {
      oneOf: [sign, emptyString],
    },
    contractors: {
      type: 'string',
    },
    accounts: {
      type: 'string',
    },
    categories: {
      type: 'string',
    },
    tags: {
      type: 'string',
    },
  },
  additionalProperties: false,
};
