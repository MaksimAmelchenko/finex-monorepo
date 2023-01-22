import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from './fields/locale';

export const emptySchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    locale,
  },
  additionalProperties: false,
};
