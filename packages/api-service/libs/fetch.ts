import got, { Options } from 'got';
import { ILogger } from '../types/app';

export type FetchOptions = Options;

export async function fetch<T>(log: ILogger, url: string, options?: Options): Promise<T> {
  const start: number = Date.now();
  try {
    const gotOptions: any = {
      responseType: 'json',
      method: 'GET',
      ...options,
    };

    const response = await got<T>(url, gotOptions);
    const duration: number = Math.ceil(Date.now() - start);
    log.trace({ duration, got: { url } });
    return response.body;
  } catch (err) {
    log.error({ got: { url }, err });
    throw err;
  }
}
