import { OpenAPIV3 } from 'openapi-types';
import { importSourceSchema } from '../../../../common/schemas/import-source.schema';

export const importSourcesSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: importSourceSchema,
};
