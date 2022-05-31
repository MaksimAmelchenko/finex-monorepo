import { getRestApi } from '../../../libs/rest-api';

import { createContractor } from './create-contractor';
import { deleteContractor } from './delete-contractor';
import { getContractors } from './get-contractors';
import { updateContractor } from './update-contractor';

export const contractorApi = getRestApi([
  //
  createContractor,
  deleteContractor,
  getContractors,
  updateContractor,
]);
