import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
        insert into cf$.change_log ( title, description )
        values ( '1.1.0 от 26.04.2021', '<ul>
<li>
Добавлена возможность экспорта данных в CSV файл. (Данные → Экспорт)   
    </li>
</ul>' );
    `);
}

export async function down(knex: Knex): Promise<void> {}
