import { IProfile, IUser, IUserDAO, IUserDTO, UserMapper } from './types';
import { ISubscription } from '../billing/subscription/types';
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
    accessUntil,
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
      accessUntil,
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

  toProfile(
    { id, name, email, timeout, projectId, currencyRateSourceId, accessUntil }: IUser,
    subscription: ISubscription | null
  ): IProfile {
    return {
      id,
      name,
      email,
      timeout,
      projectId,
      currencyRateSourceId,
      accessUntil,
      planId: subscription?.planId ?? null,
    };
  }
}

export const userMapper = new UserMapperImpl();
