import { OpenAPIV3_1 } from 'openapi-types';
import { accountsSchema } from './accounts.schema';
import { categoriesSchema } from './categories.schema';
import { contractorsSchema } from './contractors.schema';
import { moneysSchema } from './moneys.schema';
import { tagsSchema } from './tags.schema';
import { unitsSchema } from './units.schema';
import { date } from '../../../../common/schemas/fields/date';

export const useProjectResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    accounts: accountsSchema,
    contractors: contractorsSchema,
    categories: categoriesSchema,
    units: unitsSchema,
    tags: tagsSchema,
    moneys: moneysSchema,
    params: {
      type: 'object',
      properties: {
        dashboard: {
          type: 'object',
          properties: {
            dBegin: date,
            dEnd: date,
          },
          required: ['dBegin', 'dEnd'],
        },
      },
      required: ['dashboard'],
    },
  },
  required: ['accounts', 'contractors', 'categories', 'units', 'tags', 'moneys', 'params'],
  additionalProperties: false,
};
