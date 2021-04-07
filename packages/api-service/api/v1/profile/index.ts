import { getRestApi } from '../../../libs/rest-api';

import { getProfile } from './get-profile';
import { updateProfile } from './update-profile';

export const profileApi = getRestApi([
  //
  getProfile,
  updateProfile,
]);
