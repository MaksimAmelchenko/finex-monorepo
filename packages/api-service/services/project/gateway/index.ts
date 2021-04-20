import { createProject } from './methods/create-project';
import { getAllByUserId } from './methods/get-all-by-user-id';

export const ProjectGateway = {
  create: createProject,
  getAllByUserId,
};
