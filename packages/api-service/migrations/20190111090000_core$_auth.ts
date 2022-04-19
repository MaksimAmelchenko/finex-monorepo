import { Knex } from 'knex';

import { authenticate_v1 } from './core$_auth/authenticate.function/v1';
import { authorize_v1 } from './core$_auth/authorize.function/v1';
import { hash_password_v1 } from './core$_auth/hash_password.function/v1';
import { password_recovery_v1 } from './core$_auth/password_recovery.function/v1';
import { password_recovery_confirm_v1 } from './core$_auth/password_recovery_confirm.function/v1';
import { signup_v1 } from './core$_auth/signup.function/v1';
import { signup_confirm_v1 } from './core$_auth/signup_confirm.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA core$_auth;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "core$_auth" FROM PUBLIC;');
  await knex.schema.raw(authenticate_v1.up);
  await knex.schema.raw(authorize_v1.up);
  await knex.schema.raw(hash_password_v1.up);
  await knex.schema.raw(password_recovery_v1.up);
  await knex.schema.raw(password_recovery_confirm_v1.up);
  await knex.schema.raw(signup_v1.up);
  await knex.schema.raw(signup_confirm_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(authenticate_v1.down);
  await knex.schema.raw(authorize_v1.down);
  await knex.schema.raw(hash_password_v1.down);
  await knex.schema.raw(password_recovery_v1.down);
  await knex.schema.raw(password_recovery_confirm_v1.down);
  await knex.schema.raw(signup_v1.down);
  await knex.schema.raw(signup_confirm_v1.down);

  await knex.schema.raw('DROP SCHEMA core$_auth;');
}
