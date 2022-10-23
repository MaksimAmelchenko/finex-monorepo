import { OpenAPIV3_1 } from 'openapi-types';

import { invitationSchema } from '../../../../common/schemas/invitation.schema';

export const invitationsSchema: OpenAPIV3_1.SchemaObject = {
  type: 'array',
  items: invitationSchema,
};
