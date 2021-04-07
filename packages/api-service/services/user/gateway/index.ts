import { createUser } from './methods/create-user';
import { getUserByUsername } from './methods/get-user-by-username';
import { updateUser } from './methods/update-user';

// tslint:disable-next-line:variable-name
export const UserGateway = {
  create: createUser,
  getByUsername: getUserByUsername,
  update: updateUser,
};
