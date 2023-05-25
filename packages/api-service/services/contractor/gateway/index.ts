import { createContractor } from './methods/create-contractor';
import { deleteContractor } from './methods/delete-contractor';
import { getContractorByName } from './methods/get-contractor-by-name';
import { getContractors } from './methods/get-contractors';
import { updateContractor } from './methods/update-contractor';

export const ContractorGateway = {
  createContractor,
  deleteContractor,
  getContractorByName,
  getContractors,
  updateContractor,
};
