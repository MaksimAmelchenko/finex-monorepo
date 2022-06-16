import { createProject } from './methods/create-project';
import { deleteProject } from './methods/delete-project';
import { getDependencies } from './methods/get-dependencies';
import { getProject } from './methods/get-project';
import { getProjects } from './methods/get-projects';
import { updateProject } from './methods/update-project';

export const ProjectService = {
  createProject,
  deleteProject,
  getDependencies,
  getProject,
  getProjects,
  updateProject,
};
