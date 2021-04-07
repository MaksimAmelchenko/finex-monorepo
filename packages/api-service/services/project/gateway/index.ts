import { createProject } from './methods/create-project';
import { getAllByUserId } from './methods/get-all-by-user-id';

// tslint:disable-next-line:variable-name
export const ProjectGateway = {
  create: createProject,
  getAllByUserId,
};
