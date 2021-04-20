import * as xml2js from 'xml2js';
import { addDays, format, isBefore, parse } from 'date-fns';

import { IRequestContext, TDate } from '../../../types/app';
import { DB } from '../../../libs/db';
import { fetch } from '../../../libs/fetch';

export async function uploadCurrencyRates(
  ctx: IRequestContext,
  params: { dateFrom: TDate; dateTo: TDate }
): Promise<void> {
  const { dateFrom, dateTo } = params;
  let date = parse(dateFrom, 'yyyy-MM-dd', new Date());
  while (isBefore(date, parse(dateTo, 'yyyy-MM-dd', new Date()))) {
    try {
      const rates = await fetch(
        ctx.log,
        `http://openexchangerates.org/api/historical/${format(
          date,
          'yyyy-MM-dd'
        )}.json?app_id=776ed0e31d9449eaa86dbd7d0ba449dc`
      );
      const result = await DB.query(ctx.log, 'select cf$_currency.upload_openexchangerates ($1) as result', [rates]);
      ctx.log.trace({ result });
    } catch (err) {
      ctx.log.error({ err });
    }

    try {
      const xml = await fetch(
        ctx.log,
        `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${format(date, 'dd/MM/yyyy')}`,
        {
          responseType: 'text',
        }
      );

      const rates = await xml2js.parseStringPromise(xml, {
        explicitArray: false,
        explicitRoot: false,
        ignoreAttrs: false,
        mergeAttrs: true,
      });

      const result = await DB.query(ctx.log, 'select cf$_currency.upload_cbr ($1) as result', [rates]);
      ctx.log.trace({ result });
    } catch (err) {
      ctx.log.error({ err });
    }

    date = addDays(date, 1);
  }
}
