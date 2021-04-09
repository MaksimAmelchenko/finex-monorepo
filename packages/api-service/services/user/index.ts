import { createUser } from './methods/create-user';
import { updateUser } from './methods/update-user';

export const User = {
  create: createUser,
  update: updateUser,
};
