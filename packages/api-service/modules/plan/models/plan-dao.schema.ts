import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../common/schemas/fields/date';

export const planDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId: {
      type: 'integer',
    },
    id: {
      type: 'integer',
    },
    userId: {
      type: 'integer',
    },
    startDate: date,
    reportPeriod: date,
    repetitionType: {
      type: 'integer',
    },
    repetitionDays: {
      type: ['array', 'null'],
      items: {
        type: 'integer',
      },
    },
    terminationType: {
      type: ['integer', 'null'],
    },
    repetitionCount: {
      type: ['integer', 'null'],
    },
    endDate: {
      type: ['string', 'null'],
      format: 'date',
    },
    note: {
      type: ['string', 'null'],
    },
    operationNote: {
      type: ['string', 'null'],
    },
    operationTags: {
      type: ['array', 'null'],
      items: {
        type: 'integer',
      },
    },
    markerColor: {
      type: ['string', 'null'],
    },
  },
  additionalProperties: false,
  required: [
    //
    'projectId',
    'userId',
    'startDate',
    'reportPeriod',
    'repetitionType',
    'repetitionDays',
    'terminationType',
    'repetitionCount',
    'endDate',
  ],
  allOf: [
    {
      oneOf: [
        {
          properties: {
            repetitionType: {
              type: 'integer',
              enum: [0],
            },
            repetitionDays: {
              type: 'null',
            },
            terminationType: {
              type: 'null',
            },
            repetitionCount: {
              type: 'null',
            },
            endDate: {
              type: 'null',
            },
          },
        },
        {
          properties: {
            repetitionType: {
              type: 'integer',
              enum: [1],
            },
            repetitionDays: {
              type: 'array',
              items: {
                type: 'integer',
                minimum: 1,
                maximum: 7,
              },
              minItems: 1,
              maxItems: 7,
              uniqueItems: true,
            },
          },
        },
        {
          properties: {
            repetitionType: {
              type: 'integer',
              enum: [2],
            },
            repetitionDays: {
              type: 'array',
              items: {
                type: 'integer',
                minimum: 1,
                maximum: 31,
              },
              minItems: 1,
              maxItems: 31,
              uniqueItems: true,
            },
          },
        },
        {
          properties: {
            repetitionType: {
              type: 'integer',
              enum: [3, 4],
            },
            repetitionDays: {
              type: 'null',
            },
          },
        },
      ],
    },
    {
      oneOf: [
        {
          properties: {
            repetitionType: {
              type: 'integer',
              enum: [0],
            },
            repetitionDays: {
              type: 'null',
            },
            terminationType: {
              type: 'null',
            },
            repetitionCount: {
              type: 'null',
            },
            endDate: {
              type: 'null',
            },
          },
        },
        {
          properties: {
            terminationType: {
              type: 'integer',
              enum: [0],
            },
            repetitionCount: {
              type: 'null',
            },
            endDate: {
              type: 'null',
            },
          },
        },
        {
          properties: {
            terminationType: {
              type: 'integer',
              enum: [1],
            },
            repetitionCount: {
              type: 'integer',
              minimum: 2,
            },
            endDate: {
              type: 'null',
            },
          },
        },
        {
          properties: {
            terminationType: {
              type: 'integer',
              enum: [2],
            },
            repetitionCount: {
              type: 'null',
            },
            endDate: {
              type: 'string',
              format: 'date',
              formatExclusiveMinimum: { $data: '1/startDate' },
            } as any,
          },
        },
      ],
    },
  ],
};
