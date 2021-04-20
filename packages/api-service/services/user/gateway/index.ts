import { createUser } from './methods/create-user';
import { getUser } from './methods/get-user';
import { getUserByUsername } from './methods/get-user-by-username';
import { updateUser } from './methods/update-user';

export const UserGateway = {
  create: createUser,
  getById: getUser,
  getByUsername: getUserByUsername,
  update: updateUser,
};
