import { Knex } from 'knex';

// regexp_replace
export async function up(knex: Knex): Promise<void> {
  // SELECT regexp_replace('PAYPAL *NAMECHEAP', '^PAYPAL \*(.*)$', '\1', 'g')
  await knex.schema.withSchema('cf$_connection').createTable('contractor_cleaning', table => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('pattern').notNullable();
    table.comment('Pattern to match against the contractor name to clean it up');
  });
  await knex.schema.raw('GRANT SELECT ON TABLE "cf$_connection".contractor_cleaning TO web');

  await knex.schema.withSchema('cf$_connection').createTable('contractor_recognition', table => {
    table.uuid('id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('pattern').notNullable();
    table.text('name');
    table.text('income_category_prototype_id');
    table.text('expense_category_prototype_id');
  });

  await knex.schema.raw('GRANT SELECT ON TABLE "cf$_connection".contractor_recognition TO web');

  await knex.schema.raw(`
    insert
      into cf$_connection.contractor_cleaning ( pattern )
    values ( '^PAYPAL \\*(.*)$' )
  `);

  await knex.schema.raw(`
    insert
      into cf$_connection.contractor_recognition ( pattern,
                                                   name,
                                                   income_category_prototype_id,
                                                   expense_category_prototype_id )
    values ( '(Amazon\\.de)|(AMZN MKTP)|(Amazon EU S.a.r.l.)|(AMZNDIGITAL.*)|(AMZN Digital.*)|(AMZN-RATENZA.*)',
             'Amazon', null, null ),
           ( 'Amazon Music.*', 'Amazon Music', null, '70' ),
           ( '1.1 Telecom GmbH', '1+1 Telecom GmbH', null, '170' ),
           ( 'American Express.*', 'American Express', null, '430' ),
           ( 'AMZNPrime.*', 'Amazon Prime', null, '70' ),
           ( 'APPLE.COM.*', 'Apple', null, '70' ),
           ( 'Carrefour.*', 'Carrefour', null, '30' ),
           ( 'DM.Drogerie Markt', 'dm-drogerie markt', null, '130' ),
           ( 'IKEA.*', 'IKEA', null, '90' ),
           ( 'KAUFLAND.*', 'Kaufland', null, '30' ),
           ( 'Lidl.*', 'Lidl', null, '30' ),
           ( 'Mix Markt.*', 'Mix Markt', null, '30' ),
           ( 'Nobis Printen.*', 'Nobis Printen', null, '30' ),
           ( 'DISNEYPLUS.*', 'Disney+', null, '70' ),
           ( 'Revolut.*', 'Revolut', null, '430' ),
           ( 'REWE.*', 'REWE', null, '30' ),
           ( 'Rossmann.*', 'Rossmann', null, '130' ),
           ( 'Rundfunk ARD, ZDF, DRadio', null, null, '460' ),
           ( 'Shell.*', 'Shell', null, '51' ),
           ( 'Starbucks.*', 'Starbucks', null, '71' ),
           ( 'TEDi.*', 'TEDi', null, '412' ),
           ( 'Zara.*', 'Zara', null, '140' ),
           ( 'APRR.*', 'APRR', null, '50' ),
           ( '(MY TOYS.*)|(MYTOYS.*)', 'myToys', null, '412' ),
           ( 'Bundesagentur für Arbeit - Familienkasse', null, '425', null ),
           ( 'TUEV.*', null, null, '50' )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$_connection').dropTable('contractor_cleaning');
  await knex.schema.withSchema('cf$_connection').dropTable('contractor_recognition');
}
