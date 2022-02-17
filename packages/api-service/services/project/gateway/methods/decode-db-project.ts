import { IDBProject, IProject } from '../../../../types/project';

export function decodeDBProject(project: IDBProject): IProject {
  return {
    id: project.idProject,
    name: project.name,
    note: project.note,
    userId: project.idUser,
    metadata: {
      permit: project.permit,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}
