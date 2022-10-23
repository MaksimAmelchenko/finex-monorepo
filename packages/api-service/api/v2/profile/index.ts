import { getRestApi } from '../../../libs/rest-api';

import { deleteProfile } from './delete-profile';
import { getProfile } from './get-profile';
import { updateProfile } from './update-profile';

export const profileApi = getRestApi([
  //
  deleteProfile,
  getProfile,
  updateProfile,
]);
