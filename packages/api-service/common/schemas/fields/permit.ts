import { OpenAPIV3 } from 'openapi-types';
import { Permit } from '../../../types/app';

export const permit: OpenAPIV3.SchemaObject = {
  type: 'integer',
  enum: [Permit.Read, Permit.Update, Permit.Owner],
};
