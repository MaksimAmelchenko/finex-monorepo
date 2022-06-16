import { createProject } from './methods/create-project';
import { deleteProject } from './methods/delete-project';
import { getProject } from './methods/get-project';
import { getProjects } from './methods/get-projects';
import { updateProject } from './methods/update-project';

export const ProjectGateway = {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
};
