import { IProfile, IUser, IUserDAO, IUserDTO, UserMapper } from './types';
import { User } from './models/user';

class UserMapperImpl implements UserMapper {
  toDomain({
    idUser,
    name,
    email,
    password,
    timeout,
    idHousehold,
    idProject,
    idCurrencyRateSource,
    createdAt,
    updatedAt,
  }: IUserDAO): IUser {
    return new User({
      id: String(idUser),
      name,
      email,
      password,
      timeout,
      householdId: String(idHousehold),
      projectId: idProject ? String(idProject) : null,
      currencyRateSourceId: String(idCurrencyRateSource),
      createdAt,
      updatedAt,
    });
  }

  toDTO({ id, name, email }: IUser): IUserDTO {
    return {
      id,
      name,
      email,
    };
  }

  toProfile({ id, name, email, timeout, projectId, currencyRateSourceId }: IUser): IProfile {
    return {
      id,
      name,
      email,
      timeout,
      projectId,
      currencyRateSourceId,
    };
  }
}

export const userMapper = new UserMapperImpl();
