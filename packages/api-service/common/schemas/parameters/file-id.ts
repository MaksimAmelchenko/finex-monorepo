import { OpenAPIV3_1 } from 'openapi-types';

import { fileId as fileIdField } from '../fields/file-id';

export const fileId: OpenAPIV3_1.SchemaObject = {
  ...fileIdField,
  description: 'Taken from path',
};
