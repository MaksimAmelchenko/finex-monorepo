import { getRestApi } from '../../../libs/rest-api';

import { copyProject } from './copy-project';
import { createProject } from './create-project';
import { deleteProject } from './delete-project';
import { getProject } from './get-project';
import { getProjects } from './get-projects';
import { updateProject } from './update-project';
import { useProject } from './use-project';

export const projectsApi = getRestApi([
  copyProject,
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
  useProject,
]);
