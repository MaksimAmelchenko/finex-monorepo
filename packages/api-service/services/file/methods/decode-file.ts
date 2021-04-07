import { IFile, IPublicFile } from '../../../types/file';

export default function decodeFile(file: IFile): IPublicFile {
  return {
    projectId: file.projectId,
    id: file.id,
    userId: file.userId,
    name: file.name,
    contentType: file.contentType,
    size: file.size,
    metadata: {
      createdAt: file.metadata!.createdAt,
      updatedAt: file.metadata!.updatedAt,
    },
  };
}
