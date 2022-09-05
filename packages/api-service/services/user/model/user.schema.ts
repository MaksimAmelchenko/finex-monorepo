import { OpenAPIV3_1 } from 'openapi-types';
import { email } from '../../../common/schemas/fields/email';
import { dateTime } from '../../../common/schemas/fields/date-time';

export const userSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idUser: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    email,
    password: {
      type: 'string',
    },
    tz: {
      type: 'string',
    },
    timeout: {
      type: 'string',
    },
    idHousehold: {
      type: 'number',
    },
    idProject: {
      type: ['number', 'null'],
    },
    idCurrencyRateSource: {
      type: 'number',
    },
    createdAt: dateTime,
    updatedAt: dateTime,
  },
  additionalProperties: false,
  required: [
    //
    'name',
    'email',
    'password',
    'idHousehold',
    'idCurrencyRateSource',
  ],
};
