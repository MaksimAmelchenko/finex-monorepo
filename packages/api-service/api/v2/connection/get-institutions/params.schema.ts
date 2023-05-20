import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';

export const getInstitutionsParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    country: {
      type: 'string',
    },
    locale,
  },
};
