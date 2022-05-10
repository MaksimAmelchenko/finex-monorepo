import { OpenAPIV3 } from 'openapi-types';

import { idCategory } from '../../../../common/schemas/fields/id-category';

export const getCategoryParamsSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    idCategory,
  },
  additionalProperties: false,
  required: ['idCategory'],
};
