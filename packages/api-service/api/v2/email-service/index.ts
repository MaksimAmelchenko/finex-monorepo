import { getRestApi } from '../../../libs/rest-api';

import { sesNotification } from './ses-notification';

export const emailServiceApi = getRestApi([
  //
  sesNotification,
]);
