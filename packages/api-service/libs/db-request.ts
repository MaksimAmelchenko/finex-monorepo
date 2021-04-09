import { InternalError, InvalidParametersError } from './errors';
import { DB } from './db';
import { IRequestContext } from '../types/app';

export default async function dbRequest<T = Record<string, any>>(
  ctx: IRequestContext,
  operationName: string,
  params: Record<string, any>
): Promise<T> {
  const { sessionId = null } = ctx;
  const response: { result: string } = await DB.execute(
    ctx.log,
    'select core$_port.call_operation ($1, $2, $3) as result',
    [sessionId, operationName, JSON.stringify(params)]
  );

  let result;
  try {
    result = JSON.parse(response.result);
  } catch (e) {
    throw new InternalError({ devMessage: 'Error parsing server response' });
  }

  if (result.error) {
    console.log(result.error);
    throw new InvalidParametersError(result.error.message, result.error);
  }
  return result as T;
}
