import { OpenAPIV3_1 } from 'openapi-types';

export const getCountriesResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    countries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
        additionalProperties: false,
        required: [
          //
          'code',
          'name',
        ],
      },
    },
  },
  additionalProperties: false,
  required: ['countries'],
};
