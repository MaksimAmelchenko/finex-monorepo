import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').alterTable('account_type', table => {
    table.specificType('name_new', 'jsonb');
    table.renameColumn('id_account_type', 'id');
    table.dropColumn('short_name');
  });

  /*
    1	"Наличные"
    2	"Карта"
    3	"Банковский счет"
    4	"Банковский вклад"
    5	"Другое"
    6	"Кредитная карта"
    7	"Долг"
    8	"Электронные деньги"
    9	"Депозитная карта"
  */
  await knex.raw(`
    merge into cf$.account_type at
    using (
        select (value ->> 'id')::int as id,
               value -> 'name' as name
          from jsonb_array_elements('[
            {"id": 1, "name": {"ru": "Наличные", "en": "Cash", "de": "Bargeld"}},
            {"id": 3, "name": {"ru": "Текущий счёт", "en": "Current account", "de": "Girokonto"}},
            {"id": 4, "name": {"ru": "Депозит", "en": "Deposit", "de": "Deposit"}},
            {"id": 6, "name": {"ru": "Кредитный счёт", "en": "Credit account", "de": "Kreditkonto"}},
            {"id": 8, "name": {"ru": "Электронный кошелек", "en": "E-wallet", "de": "E-Wallet"}},
            {"id": 10, "name": {"ru": "Сберегательный счёт", "en": "Savings account", "de": "Sparkonto"}},
            {"id": 11, "name": {"ru": "Инвестиционный счёт", "en": "Investment account", "de": "Investmentkonto"}},
            {"id": 12, "name": {"ru": "Пенсионный счёт", "en": "Pension account", "de": "Pensionskonto"}}
    ]'::jsonb) as value) s
      on s.id = at.id
    when matched then
      update
         set name_new = s.name
    when not matched then
      insert (id, name, name_new)
      values (s.id, s.name->>'ru', s.name)
  `);

  await knex.raw(`
    select context.set('isNotCheckPermit', '1')
  `);

  // Card, Others, Deposit Card -> Current account
  await knex.raw(`
    update cf$.account a
       set id_account_type = 3
     where id_account_type in (2, 5, 9)
  `);

  // Debt -> Credit account
  await knex.raw(`
    update cf$.account a
       set id_account_type = 6
     where id_account_type in (7)
  `);

  await knex.raw(`
    delete
      from cf$.account_type
     where id in (2, 5, 7, 9)
  `);

  await knex.raw(`
    select context.set('isNotCheckPermit', '')
  `);

  await knex.schema.withSchema('cf$').alterTable('account_type', table => {
    table.dropColumn('name');
    table.renameColumn('name_new', 'name');
  });
}

export async function down(knex: Knex): Promise<void> {}
