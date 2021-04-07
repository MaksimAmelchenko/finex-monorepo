import { getRestApi } from '../../../libs/rest-api';

import { createContractor } from './create-contractor';
import { deleteContractor } from './delete-contractor';
import { getContractors } from './get-contractors';
import { getContractor } from './get-contractor';
import { updateContractor } from './update-contractor';

export const contractorsApi = getRestApi([
  //
  createContractor,
  deleteContractor,
  getContractors,
  getContractor,
  updateContractor,
]);
