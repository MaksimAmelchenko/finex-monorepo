import { format } from 'date-fns';
import * as zlib from 'zlib';
import * as numeral from 'numeral';
import 'numeral/locales/ru';
import { ru } from 'date-fns/locale';

import { createObjectCsvStringifier } from 'csv-writer';

import { IRequestContext } from '../../../types/app';
import { DB } from '../../../libs/db';
import { TransactionalEmail } from '../../transactional-email';
import { Template } from '../../../types/transactional-email';
import { AccessDeniedError } from '../../../libs/errors';
import { SessionService } from '../../session';
import { userService } from '../../../modules/user/user.service';

numeral.locale('ru');

function formatCurrency(value: string | number): string {
  return numeral(value).format('0.00[0000000000]');
}

function formatQuantity(value: string | number): string {
  return numeral(value).format('0.[0000000000]');
}

export async function exportToCsv(ctx: IRequestContext<never, true>): Promise<void> {
  const { sessionId, userId } = ctx;
  if (!sessionId) {
    throw new AccessDeniedError('Unauthorized access');
  }
  const [session, user] = await Promise.all([
    //
    SessionService.getSession(ctx, sessionId),
    userService.getUser(ctx, userId),
  ]);

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'date', title: 'Дата' },
      { id: 'accountName', title: 'Счет' },
      { id: 'type', title: 'Тип' },
      { id: 'categoryName1', title: 'Категория1' },
      { id: 'categoryName2', title: 'Категория2' },
      { id: 'categoryName3', title: 'Категория3' },
      { id: 'quantity', title: 'Количество' },
      { id: 'unitName', title: 'Ед.изм.' },
      { id: 'sum', title: 'Сумма' },
      { id: 'currency', title: 'Валюта' },
      { id: 'contractorName', title: 'Контрагент' },
      { id: 'note', title: 'Примечание' },
      { id: 'tags', title: 'Теги' },
    ],
  });

  const sqlText = `
    select cfd.dcashflow_detail as date,
           a.name as account_name,
           cf.id_cashflow_type,
           cf$_category.full_name(cfd.id_category, '/', cfd.id_project) as category_full_name,
           cfd.quantity,
           u.name as unit_name,
           cfd.sum * cfd.sign as sum,
           coalesce(currency.code, m.symbol) as currency,
           contractor.name as contractor_name,
           cfd.note,
           (select array(select t.name
                           from unnest(cfd.tags) Id_Tag
                                  join cf$.tag t
                                       using (Id_Tag))
           ) as tags
      from cf$_account.permit($1, $2) p
             join cf$.cashflow_detail cfd
                  on (cfd.id_project = p.project_id and cfd.id_account = p.account_id)
             join cf$.cashflow cf
                  on (cf.id_project = cfd.id_project and cf.id_cashflow = cfd.id_cashflow)
             join cf$.account a
                  on (a.id_project = cfd.id_project and a.id_account = cfd.id_account)
             join cf$.category c
                  on (c.id_project = cfd.id_project and c.id_category = cfd.id_category)
             join cf$.money m
                  on (m.id_project = cfd.id_project and m.id_money = cfd.id_money)
             left join cf$.currency
                       on (currency.id_currency = m.id_currency)
             left join cf$.contractor
                       on (contractor.id_project = cf.id_project and contractor.id_contractor = cf.id_contractor)
             left join cf$.unit u
                       on (u.id_project = cfd.id_project and u.id_unit = cfd.id_unit)
     order by date, cf.id_cashflow
  `;

  const table = await DB.query(ctx.log, sqlText, [session.idProject, Number(userId)]);

  const records = table.map(item => {
    const [categoryName1, categoryName2, categoryName3] = item.category_full_name.split('/');
    return {
      date: format(item.date, 'P', { locale: ru }),
      accountName: item.account_name,
      type: { 1: 'Доход\\Расход', 2: 'Долг', 3: 'Перевод', 4: 'Обмен валюты' }[item.id_cashflow_type],
      categoryName1,
      categoryName2,
      categoryName3,
      quantity: formatQuantity(item.quantity),
      unitName: item.unit_name,
      sum: formatCurrency(item.sum),
      currency: item.currency,
      contractorName: item.contractor_name,
      note: item.note,
      tags: item.tags.join(', '),
    };
  });

  const payload = Buffer.from(csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records));

  zlib.gzip(payload, {}, (err, buffer) => {
    if (!err) {
      TransactionalEmail.send(ctx, {
        template: Template.Export,
        email: user.email,
        locals: {},
        attachments: [
          {
            filename: `transactions_export_${format(new Date(), 'yyyy-MM-dd')}.csv.zip`,
            content: buffer,
          },
        ],
      }).catch(err => ctx.log.fatal({ err }));
    }
  });
}
