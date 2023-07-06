import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    update billing$.plan
       set price = 3.7,
           paypal_plan_id = 'P-2ES05931GM608423UMSS54SA',
           available_payment_gateways = '{"paypal"}'
     where id = 'monthlyEur';
  `);

  await knex.schema.raw(`
    update billing$.plan
       set price = 35.5,
           paypal_plan_id = 'P-2YU504617L6792048MSS54RY',
           available_payment_gateways = '{"paypal"}'
     where id = 'annualEur';
  `);
}

export async function down(knex: Knex): Promise<void> {}
