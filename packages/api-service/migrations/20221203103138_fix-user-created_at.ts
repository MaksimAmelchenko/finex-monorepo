import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
      with sur as (
        select email,
               confirmed_at
          from core$.signup_request
         where confirmed_at is not null
      )
    update core$.user u
       set created_at = sur.confirmed_at,
           updated_at = sur.confirmed_at
      from sur
     where u.email = sur.email
  `);
}

export async function down(knex: Knex): Promise<void> {}
