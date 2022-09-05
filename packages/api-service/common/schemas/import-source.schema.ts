import { OpenAPIV3_1 } from 'openapi-types';

export const importSourceSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idImportSource: { type: 'integer' },
    name: {
      type: 'string',
    },
    note: {
      type: 'string',
    },
    importSourceType: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
          },
          name: {
            type: 'string',
          },
          help: {
            type: 'string',
          },
          note: {
            type: 'string',
          },
          delimiter: {
            type: 'string',
          },
        },
        additionalProperties: false,
        required: ['code', 'name', 'note', 'help', 'delimiter'],
      },
    },
  },
  additionalProperties: false,
  required: ['idImportSource', 'name', 'note', 'importSourceType'],
};
