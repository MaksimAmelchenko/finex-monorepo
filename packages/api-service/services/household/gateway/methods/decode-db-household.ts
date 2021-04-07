import { IDBHousehold, IHousehold } from '../../../../types/household';

export function decodeDBHousehold(household: IDBHousehold): IHousehold {
  return {
    id: household.id_household,
    metadata: {
      createdAt: household.created_at,
      updatedAt: household.updated_at,
    },
  };
}
