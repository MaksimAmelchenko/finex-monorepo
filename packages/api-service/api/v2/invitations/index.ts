import { getRestApi } from '../../../libs/rest-api';

import acceptInvitation from './accept-invitation';
import createInvitation from './create-invitation';
import rejectInvitation from './reject-invitation';

export const invitationsApi = getRestApi([
  //
  acceptInvitation,
  createInvitation,
  rejectInvitation,
]);
