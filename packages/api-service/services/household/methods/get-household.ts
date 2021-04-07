import { IRequestContext } from '../../../types/app';
import { HouseholdGateway } from '../gateway';
import { IHousehold } from '../../../types/household';

export async function getHousehold(ctx: IRequestContext, householdId: number): Promise<IHousehold> {
  return HouseholdGateway.get(ctx, householdId);
}
