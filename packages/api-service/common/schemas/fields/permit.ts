import { OpenAPIV3_1 } from 'openapi-types';

import { Permit } from '../../../types/app';

export const permit: OpenAPIV3_1.SchemaObject = {
  type: 'integer',
  enum: [Permit.Read, Permit.Update, Permit.Owner],
};
