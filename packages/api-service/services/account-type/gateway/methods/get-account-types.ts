import { IRequestContext } from '../../../../types/app';
import { AccountType } from '../../model/account-type';

export async function getAccountTypes(ctx: IRequestContext): Promise<AccountType[]> {
  ctx.log.trace('try to get account types');

  return AccountType.query(ctx.trx);
}
