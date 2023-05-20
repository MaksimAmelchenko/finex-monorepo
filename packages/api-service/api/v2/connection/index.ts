import { getRestApi } from '../../../libs/rest-api';

import { deleteConnection } from './delete-connection';
import { getConnections } from './get-connections';
import { getCountries } from './get-countries';
import { getInstitutions } from './get-institutions';
import { unlinkAccount } from './unlink-account';
import { updateAccount } from './update-account';

export const connectionApi = getRestApi([
  //
  deleteConnection,
  getConnections,
  getCountries,
  getInstitutions,
  unlinkAccount,
  updateAccount,
]);
