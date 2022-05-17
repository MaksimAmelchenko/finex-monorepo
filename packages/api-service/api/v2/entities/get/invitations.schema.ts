import { OpenAPIV3 } from 'openapi-types';
import { invitationSchema } from '../../../../common/schemas/invitation.schema';

export const invitationsSchema: OpenAPIV3.SchemaObject = {
  type: 'array',
  items: invitationSchema,
};
