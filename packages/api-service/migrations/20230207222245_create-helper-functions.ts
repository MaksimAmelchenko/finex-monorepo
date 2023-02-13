import { Knex } from 'knex';

import { get_categories_recursive_int_array_of_int_v1 } from './cf$_category/get_categories_recursive_integer_integer[].function/v1';
import { get_categories_recursive_integer_text_v1 } from './cf$_category/get_categories_recursive_integer_text.function/v1';
import { permit__integer_integer_v1 } from './cf$_account/permit__integer_integer.function/v1';
import { permit__integer_integer_v2 } from './cf$_account/permit__integer_integer.function/v2';

import { get_contractors_integer_text_v1 } from './cf$_contractor/get_contractors_integer_text.function/v1';

import { get_tags_integer_text_v1 } from './cf$_tag/get_tags_integer_text.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(get_categories_recursive_int_array_of_int_v1.up);
  await knex.schema.raw('GRANT EXECUTE ON FUNCTION "cf$_category".get_categories_recursive(int, int[]) TO web');

  await knex.schema.raw(get_categories_recursive_integer_text_v1.up);
  await knex.schema.raw('GRANT EXECUTE ON FUNCTION "cf$_category".get_categories_recursive(int, text) TO web');

  await knex.schema.raw(permit__integer_integer_v1.down);
  await knex.schema.raw(permit__integer_integer_v2.up);
  await knex.schema.raw('GRANT EXECUTE ON FUNCTION "cf$_account".permit(int, int) TO web');

  await knex.schema.raw(get_contractors_integer_text_v1.up);
  await knex.schema.raw('GRANT EXECUTE ON FUNCTION "cf$_contractor".get_contractors(int, text) TO web');
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_contractor" TO web');

  await knex.schema.raw(get_tags_integer_text_v1.up);
  await knex.schema.raw('GRANT EXECUTE ON FUNCTION "cf$_tag".get_tags(int, text) TO web');
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_tag" TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE EXECUTE ON FUNCTION "cf$_category".get_categories_recursive(int, int[]) FROM web');
  await knex.schema.raw(get_categories_recursive_int_array_of_int_v1.down);

  await knex.schema.raw('REVOKE EXECUTE ON FUNCTION "cf$_category".get_categories_recursive(int, text) FROM web');
  await knex.schema.raw(get_categories_recursive_integer_text_v1.down);

  await knex.schema.raw(permit__integer_integer_v2.down);
  await knex.schema.raw(permit__integer_integer_v1.up);
  await knex.schema.raw('GRANT EXECUTE ON FUNCTION "cf$_account".permit(int, int) TO web');

  await knex.schema.raw('REVOKE USAGE ON SCHEMA "cf$_contractor" FROM web');
  await knex.schema.raw('REVOKE EXECUTE ON FUNCTION "cf$_contractor".get_contractors(int, text) FROM web');
  await knex.schema.raw(get_contractors_integer_text_v1.down);

  await knex.schema.raw('REVOKE USAGE ON SCHEMA "cf$_tag" FROM web');
  await knex.schema.raw('REVOKE EXECUTE ON FUNCTION "cf$_tag".get_tags(int, text) FROM web');
  await knex.schema.raw(get_tags_integer_text_v1.down);
}
