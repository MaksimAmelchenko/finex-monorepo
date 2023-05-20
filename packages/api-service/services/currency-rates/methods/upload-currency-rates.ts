import * as xml2js from 'xml2js';
import { addDays, format, isBefore, parse } from 'date-fns';

import config from '../../../libs/config';
import { IRequestContext, TDate } from '../../../types/app';
import { fetch } from '../../../libs/fetch';
import { knex } from '../../../knex';

const openExchangeRatesAppId = config.get('currencyRate:openExchangeRates:appId');

export async function uploadCurrencyRates(
  ctx: IRequestContext,
  params: { dateFrom: TDate; dateTo: TDate }
): Promise<void> {
  const { dateFrom, dateTo } = params;
  let date = parse(dateFrom, 'yyyy-MM-dd', new Date());

  while (isBefore(date, parse(dateTo, 'yyyy-MM-dd', new Date()))) {
    try {
      const { timestamp, rates } = await fetch<any>(
        ctx.log,
        `http://openexchangerates.org/api/historical/${format(
          date,
          'yyyy-MM-dd'
        )}.json?app_id=${openExchangeRatesAppId}&show_alternative=true`
      );

      let query = knex.raw(
        `
          merge into cf$.currency_rate c
          using (
              select key as currency_code,
                     value::numeric as rate
                  from jsonb_each_text(:rates::jsonb)) s
             on      c.currency_rate_source_id = 1
                 and c.rate_date = (to_timestamp(:timestamp::int) at time zone 'utc')::date
                 and c.currency_code = s.currency_code
          when matched then
            update
               set rate = s.rate
          when not matched then
            insert (currency_rate_source_id, currency_code, rate_date, rate)
            values (1, s.currency_code, (to_timestamp(:timestamp::int) at time zone 'utc')::date, s.rate)
        `,
        {
          rates,
          timestamp,
        }
      );

      if (ctx.trx) {
        query = query.transacting(ctx.trx);
      }
      await query;
    } catch (err) {
      ctx.log.error({ err });
    }

    try {
      const xml = await fetch(
        ctx.log,
        `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${format(date, 'dd/MM/yyyy')}`,
        {
          responseType: 'text',
        }
      );

      const { Date: rateDate, Valute: rates } = await xml2js.parseStringPromise(xml, {
        explicitArray: false,
        explicitRoot: false,
        ignoreAttrs: false,
        mergeAttrs: true,
        valueProcessors: [
          (value, name) => {
            if (name === 'Name') {
              return '';
            }
            if (name === 'Value') {
              return Number(value.replace(',', '.'));
            }
            if (name === 'Nominal') {
              return Number(value);
            }
            return value;
          },
        ],
      });

      let query = knex.raw(
        `
            merge into cf$.currency_rate c
            using (
                select value->>'CharCode' as currency_code,
                       (value->>'Nominal')::numeric / (value->>'Value')::numeric as rate
                    from jsonb_array_elements(:rates::jsonb) as value) s
               on      c.currency_rate_source_id = 2
                   and c.rate_date = :rateDate::date
                   and c.currency_code = s.currency_code
            when matched then
              update
                 set rate = s.rate
            when not matched then
              insert (currency_rate_source_id, currency_code, rate_date, rate)
              values (2, s.currency_code, :rateDate::date, s.rate)
          `,
        {
          rates: JSON.stringify(rates),
          rateDate: format(parse(rateDate, 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd'),
        }
      );

      if (ctx.trx) {
        query = query.transacting(ctx.trx);
      }
      await query;
    } catch (err) {
      ctx.log.error({ err });
    }

    date = addDays(date, 1);
  }
}
