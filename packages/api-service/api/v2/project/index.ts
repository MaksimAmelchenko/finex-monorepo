import { getRestApi } from '../../../libs/rest-api';

import { copyProject } from './copy-project';
import { createProject } from './create-project';
import { deleteProject } from './delete-project';
import { getProjects } from './get-projects';
import { mergeProject } from './merge-project';
import { updateProject } from './update-project';
import { useProject } from './use-project';

export const projectApi = getRestApi([
  copyProject,
  createProject,
  deleteProject,
  getProjects,
  mergeProject,
  updateProject,
  useProject,
]);
