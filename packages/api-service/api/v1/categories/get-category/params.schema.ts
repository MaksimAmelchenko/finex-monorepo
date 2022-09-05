import { OpenAPIV3_1 } from 'openapi-types';

import { idCategory } from '../../../../common/schemas/fields/id-category';

export const getCategoryParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idCategory,
  },
  additionalProperties: false,
  required: ['idCategory'],
};
