import { createContractor } from './methods/create-contractor';
import { deleteContractor } from './methods/delete-contractor';
import { getContractors } from './methods/get-contractors';
import { updateContractor } from './methods/update-contractor';

export const ContractorGateway = {
  createContractor,
  deleteContractor,
  getContractors,
  updateContractor,
};
