import { OpenAPIV3_1 } from 'openapi-types';
import { dateTime } from './fields/date-time';

export const metadata: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    createdAt: {
      ...dateTime,
      example: '2017-05-21T21:58:18Z',
    },
    updatedAt: {
      ...dateTime,
      example: '2017-06-12T23:02:41Z',
    },
  },
  required: ['createdAt'],
  additionalProperties: false,
};
