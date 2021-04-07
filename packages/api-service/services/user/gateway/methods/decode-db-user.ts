import { IDBUser, IUser } from '../../../../types/user';

export function decodeDBUser(user: IDBUser): IUser {
  return {
    id: user.id_user,
    name: user.name,
    email: user.email,
    password: user.password,
    householdId: user.id_household,
    projectId: user.id_project,
    currencyRateSourceId: user.id_currency_rate_source,
    timeout: user.timeout || 'PT20M',
    metadata: {
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
  };
}
