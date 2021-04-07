import { OpenAPIV3 } from 'openapi-types';

import { fileId as fileIdField } from '../fields/file-id';

export const fileId: OpenAPIV3.SchemaObject = {
  ...fileIdField,
  description: 'Taken from path',
};
