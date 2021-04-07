import { IDBProject, IProject } from '../../../../types/project';

export function decodeDBProject(project: IDBProject): IProject {
  return {
    id: project.id_project,
    name: project.name,
    note: project.note,
    userId: project.id_user,
    metadata: {
      permit: project.permit,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    },
  };
}
