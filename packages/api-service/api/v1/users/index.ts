import { getRestApi } from '../../../libs/rest-api';

import { getUser } from './get-user';
import { getUsers } from './get-users';

export const usersApi = getRestApi([
  //
  getUser,
  getUsers,
]);
