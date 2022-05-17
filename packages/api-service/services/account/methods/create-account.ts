import { AccountGateway } from '../gateway';
import { CreateAccountServiceData, CreateAccountServiceResponse } from '../types';
import { IRequestContext } from '../../../types/app';

export async function createAccount(
  ctx: IRequestContext,
  data: CreateAccountServiceData
): Promise<CreateAccountServiceResponse> {
  return AccountGateway.createAccount(ctx, data);
}
