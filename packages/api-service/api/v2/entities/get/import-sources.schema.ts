import { OpenAPIV3_1 } from 'openapi-types';
import { importSourceSchema } from '../../../../common/schemas/import-source.schema';

export const importSourcesSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: importSourceSchema,
};
