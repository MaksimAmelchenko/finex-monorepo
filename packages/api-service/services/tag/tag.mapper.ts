import { ITag, ITagDAO, ITagDTO, TagMapper } from './types';

class TagMapperImpl implements TagMapper {
  toDomain(tag: ITagDAO): ITag {
    const { idTag, name, idUser } = tag;

    return {
      id: String(idTag),
      userId: String(idUser),
      name,
    };
  }

  toDTO(tag: ITag): ITagDTO {
    const { id, name, userId } = tag;
    return {
      id,
      userId,
      name,
    };
  }
}

export const tagMapper = new TagMapperImpl();
