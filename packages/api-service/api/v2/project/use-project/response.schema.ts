import { OpenAPIV3 } from 'openapi-types';
import { accountsSchema } from './accounts.schema';
import { categoriesSchema } from './categories.schema';
import { contractorsSchema } from './contractors.schema';
import { moneysSchema } from './moneys.schema';
import { tagsSchema } from './tags.schema';
import { unitsSchema } from './units.schema';
import { date } from '../../../../common/schemas/fields/date';
import { dateTime } from '../../../../common/schemas/fields/date-time';

export const useProjectResponseSchema: OpenAPIV3.SchemaObject = {
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
            dBegin: dateTime,
            dEnd: dateTime,
          },
          required: ['dBegin', 'dEnd'],
        },
      },
      required: ['dashboard'],
    },
    badges: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          menuItem: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        additionalProperties: false,
        required: ['menuItem', 'title', 'value'],
      },
    },
  },
  required: ['accounts', 'contractors', 'categories', 'units', 'tags', 'moneys', 'params'],
  additionalProperties: false,
};
