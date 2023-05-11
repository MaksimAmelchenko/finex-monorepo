import { OpenAPIV3_1 } from 'openapi-types';

import { ConnectionProvider } from '../types';
import { dateTime } from '../../../common/schemas/fields/date-time';
import { id } from '../../../common/schemas/fields/id';

export const connectionDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    projectId: {
      type: 'number',
    },
    userId: {
      type: 'number',
    },
    id,
    institutionName: {
      type: 'string',
    },
    institutionLogo: {
      type: 'string',
      format: 'uri',
    },
    provider: {
      type: 'string',
      enum: [ConnectionProvider.Nordigen],
    },
    createdAt: dateTime,
    updatedAt: dateTime,
  },
  additionalProperties: false,
  required: [
    //
    'projectId',
    'userId',
    'id',
    'institutionName',
    'institutionLogo',
    'provider',
  ],
};
