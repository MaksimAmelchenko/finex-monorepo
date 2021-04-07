import { createUser } from './methods/create-user';
import { updateUser } from './methods/update-user';

// tslint:disable-next-line:variable-name
export const User = {
  create: createUser,
  update: updateUser,
};
