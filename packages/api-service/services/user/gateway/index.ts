import { createUser } from './methods/create-user';
import { getUserByUsername } from './methods/get-user-by-username';
import { updateUser } from './methods/update-user';

export const UserGateway = {
  create: createUser,
  getByUsername: getUserByUsername,
  update: updateUser,
};
