import { IRequestContext } from '../../../types/app';
import { HouseholdGateway } from '../gateway';
import { IHousehold } from '../../../types/household';

export async function createHousehold(ctx: IRequestContext): Promise<IHousehold> {
  return HouseholdGateway.create(ctx);
}
