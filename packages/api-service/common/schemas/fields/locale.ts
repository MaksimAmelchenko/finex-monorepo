import { OpenAPIV3_1 } from 'openapi-types';

import { Locale } from '../../../types/app';

export const locale: OpenAPIV3_1.SchemaObject = {
  type: 'string',
  enum: [Locale.En, Locale.Ru, Locale.De],
  example: Locale.En,
};
