import { OpenAPIV3_1 } from 'openapi-types';

import { locale } from '../../../../common/schemas/fields/locale';
import { tagId } from '../../../../common/schemas/fields/tag-id';

export const deleteTagParamsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    tagId,
    locale,
  },
  additionalProperties: false,
  required: ['tagId'],
};
