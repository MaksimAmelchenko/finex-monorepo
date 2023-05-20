import { OpenAPIV3_1 } from 'openapi-types';

import { id } from '../../../../common/schemas/fields/id';
import { locale } from "../../../../common/schemas/fields/locale";

export const deleteConnectionsParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    connectionId: id,
    locale,
  },
  additionalProperties: false,
  required: ['connectionId'],
};
