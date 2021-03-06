import { Knex } from 'knex';

import { change_log_bi_v1 } from './cf$/change_log_bi.function/v1';
import { change_log_bi_trigger_v1 } from './cf$/change_log_bi.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(change_log_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('change_log', table => {
      table.specificType('id_change_log', 'serial').notNullable().comment('ID обновления');

      table.text('title').notNullable().comment('Заголовок обновления');
      table.text('description').notNullable().comment('html - описание обновления');
      table.timestamp('dset').notNullable().comment('Дата установки обновления');
    })
    .raw(change_log_bi_trigger_v1.up);

  await knex.schema.raw(`
        insert into cf$.change_log ( id_change_log, title, description, dset )
        values ( 1, '0.9.1 от 23.04.2015',
                 '<ul>
    <li>
        на панель добавлена информация по долгам («Я должен», «Мне должны»)
    </li>
    <li>
        переработан импорт долговых счетов из Дребеденег
        ( <a href="http://community.finex.io/topic/707197-oshibka-importa-dannyih-iz-dd/"
             target="_blank"> см. эту тему</a>)
    </li>
    <li>
        изменены режим отображения графиков ежедневных остаток на панеле
    </li>
    <li>
        показ ежедневных остатков только для активных валют
    </li>
</ul>',
                 '2015-04-23 06:02:07.000000' ),
               ( 2, '0.9.2 от 25.04.2015', '<ul>
    <li>
        добавлен импорт данных из HomeMoney.ua / MaxFIN.ru
    </li>
</ul>
', '2015-04-25 06:02:07.000000' ),
               ( 3, '0.9.3 от 29.04.2015', '<ul>
    <li>
        доработан импорт из Дребеденег: автоматическое создание валют
    </li>
    <li>

        изменен порядок сортировки счетов и категорий: неактивные элементы показываются снизу
    </li>
    <li>
        оптимизирован ввод приходных и расходных операций: после выбора категории и нажатии на «Tab»
        фокус переходит сразу в поле «Сумма».
    </li>
</ul>
', '2015-04-29 06:03:02.000000' ),
               ( 4, '0.9.4 от 04.05.2015', '<ul>
    <li>
        добавлены строки «Всего» и «Всего по выделенным ...» для журнала операций, долгов, переводов
        и для денежного потока
    </li>
    <li>
        исправлены ошибки
    </li>
</ul>
', '2015-05-04 06:03:41.000000' ),
               ( 6, '0.9.5 от 12.05.2015', '<ul>
    <li>
 добавлено сообщение об обновлениях сервиса с момента последнего использования
    </li>
    <li>
 добавлено приветственное  сообщение для новых пользователей
    </li>
</ul>', '2015-05-12 11:58:46.000000' ),
               ( 7, '0.10.0 от 16.06.2015', '<ul>
    <li>
 добавлено планирование доходов и расходов
    </li>
  </ul>', '2015-06-16 11:22:20.000000' ),
               ( 8, '0.10.1 от 28.06.2015', '<ul>
<li>
добавлено планирование переводов и обменов валют
    </li>
</ul>', '2015-06-29 09:13:08.000000' ),
               ( 9, '0.10.1.1 от 10.07.2015', '<ul>
<li>
исправлены ошибки копирования и объединения проектов
    </li>
</ul>', '2015-07-10 16:04:45.000000' ),
               ( 10, '0.14.0 от 21.02.2016', '<ul>
    <li>
      В отчет "Динамика" добавлен тип отчета "Сальдо" (Для табличного вида)
    </li>
    <li>
      В отчет "Динамика" добавлен параметр "Учитывать запланированные операции"
    </li>
</ul>', '2016-02-21 10:52:05.000000' ),
               ( 11, '0.15.0 от 02.03.2016', '<ul>
    <li>
      Добавлено подтверждение на удаление нескольких операций
    </li>
</ul>', '2016-03-02 19:44:10.000000' ),
               ( 12, '0.16.0 от 03.01.2017', '<ul>
<li>
Для валюты можно указывать точность. Введено для работы с криптовалютами, где количество знаков после запятой более двух.
    </li>
</ul>', '2018-01-03 13:04:23.000000' );
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.change_log');
  await knex.schema.raw(change_log_bi_v1.down);
}
