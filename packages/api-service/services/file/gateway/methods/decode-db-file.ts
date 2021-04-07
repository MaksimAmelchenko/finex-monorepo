import { IFile } from '../../../../types/file';

export default function decodeDBFile(file: any): IFile {
  return {
    projectId: file.id_project,
    id: file.id_file,
    userId: file.id_user,
    name: file.name,
    size: file.size,
    contentType: file.contentType,
    metadata: {
      createdAt: file.created_at,
      updatedAt: file.updated_at,
    },
  };
}
