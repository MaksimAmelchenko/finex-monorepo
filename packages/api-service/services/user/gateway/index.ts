import { createUser } from './methods/create-user';
import { deleteUser } from './methods/delete-user';
import { getUser } from './methods/get-user';
import { getUserByUsername } from './methods/get-user-by-username';
import { getUsers } from './methods/get-users';
import { updateUser } from './methods/update-user';

export const UserGateway = {
  createUser,
  deleteUser,
  getUser,
  getUserByUsername,
  getUsers,
  updateUser,
};
