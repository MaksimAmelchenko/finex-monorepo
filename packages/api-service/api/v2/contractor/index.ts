import { getRestApi } from '../../../libs/rest-api';

import { createCategory } from './create-contractor';
import { deleteCategory } from './delete-contractor';
import { getContractors } from './get-contractors';
import { updateContractor } from './update-contractor';

export const contractorApi = getRestApi([
  //
  createCategory,
  deleteCategory,
  getContractors,
  updateContractor,
]);
