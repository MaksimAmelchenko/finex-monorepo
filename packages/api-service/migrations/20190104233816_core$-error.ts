import * as Knex from 'knex';
import { v_error_v1 } from './core$/v_error.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').createTable('error', table => {
    table
      .text('code')
      // .notNullable()
      .unique();
    table.integer('status').notNullable().comment('HTTP Status');
    table.text('message');
    table.text('dev_message');
    table.text('more_info');
    table.text('note');
  });
  await knex.schema.raw(v_error_v1.up);

  await knex.schema.raw(`
        insert
          into core$.error ( code, status, message, dev_message, more_info, note )
        values ( 'unique_violation.unit_id_project_name_u', 400,
                 'Единица измерения с таким наименованием уже существует', null, null, null ),
               ( 'internal_server_error', 500, null, 'Internal server error', null, 'Internal server error' ),
               ( 'invalid_parameters', 400, null, 'Invalid parameters / bad request', null, 'Invalid parameters' ),
               ( 'bad_request', 400, null, 'check request parameters', null, 'Bad request' ),
               ( 'check_violation.tag_name_is_too_long', 400,
                 'Слишком длинное наименование тэга. Максимальная длина - 30 символов', null, null, null ),
               ( 'permission_denied', 403, 'Доступ запрещен', 'Permission denied', null, null ),
               ( 'unique_violation', 400, null, 'Duplicate key value violates unique constraint', null, null ),
               ( 'check_violation.account_name_is_empty', 400, 'Наименование счета не может быть пустым', null, null,
                 null ),
               ( 'unique_violation.project_id_user_name_u', 400, 'Проект с таким названием уже существует', null, null,
                 null ),
               ( 'error_loading_file', 500, null, 'An error occurred during loading file', null, null ),
               ( 'invalid_file_format', 400, null, null, null, null ),
               ( 'check_violation.user_name_is_empty', 400, 'Имя пользователя не может быть пустым', null, null, null ),
               ( 'error_during_operation', 500, null, 'An error occurred during operation', null,
                 'An error occurred during operation' ),
               ( 'operation_is_not_found', 405, null, 'Operation is not found', null, 'Operation isn''''t  found' ),
               ( 'check_violation.user_ email_is_too_long', 400,
                 'Слишком длинный адрес электронной почты. Максимальная длина - 50 символов', null, null, null ),
               ( 'check_violation.user_email_is_empty', 400, 'Адрес электронной почты не может быть пустым', null, null,
                 null ),
               ( 'check_violation.user_name_is_too_long', 400,
                 'Слишком длинное имя пользователя. Максимальная длина - 50 символов', null, null, null ),
               ( 'check_violation.unit_name_is_too_long', 400,
                 'Слишком длинное наименование. Максимальная длина - 20 символов', null, null, null ),
               ( 'disabled_operation', 405, null, 'Bad request', null, null ),
               ( 'authorization_expired', 401, 'Истекло время простоя. Выполните вход заново', 'Authorization expired',
                 null, 'Authorization expired' ),
               ( 'check_violation.cashflow_detail_sum_check', 400, 'Сумма должна быть больше 0', null, null, null ),
               ( 'unique_violation.account_id_project_name_u', 400, 'Счет с таким названием уже существует', null, null,
                 null ),
               ( 'set_context_failed', 500, 'Ошибка при запуске приложения. Попробуйте позже',
                 'Can''''t set application context', null, null ),
               ( 'unique_violation.users_email_u', 400, 'Пользователь с таким e-mail уже существует', null, null,
                 null ),
               ( 'unique_violation.tag_id_project_name_u', 400, 'Тэг с таким наименование уже существует', null, null,
                 null ),
               ( 'foreign_key_violation.cashflow_detail_2_unit', 400, 'Найдены транзакции с данной ед.измерения', null,
                 null, null ),
               ( 'foreign_key_violation.cashflow_detail_2_account', 400,
                 'Ошибка удаления: найдены транзакции по данному счету', null, null, null ),
               ( 'check_violation.unit_name_is_empty', 400, 'Наименование единицы измерения не может быть пустым', null,
                 null, null ),
               ( 'check_violation.tag_name_is_empty', 400, 'Наименование тэга не может быть пустым', null, null, null ),
               ( 'check_violation.project_name_is_too_long', 400,
                 'Слишком длинное наименование. Максимальная длина - 100 символов', null, null, null ),
               ( 'check_violation.project_name_is_empty', 400, 'Наименование проекта не может быть пустым', null, null,
                 null ),
               ( 'check_violation.cashflow_detail_quantity_check', 400, 'Количество должно быть больше 0', null, null,
                 null ),
               ( 'check_violation.account_name_is_too_long', 400,
                 'Слишком длинное наименование. Максимальная длина - 100 символов', null, null, null ),
               ( 'authentication_failed', 401, 'Имя пользователя или пароль введены неверно', 'Authentication failed',
                 null, 'Authentication failed' ),
               ( 'no_data_found', 404, 'Запрашиваемая запись не найдена', 'Record not found', null, null ),
               ( 'foreign_key_violation.cashflow_2_contractor', 400, 'Найдены транзакции по этому контрагенту', null,
                 null, null ),
               ( 'authorization_failed', 401, 'Ошибка авторизации. Выполните вход заново',
                 'Не найдена сессия по заданному token ', null, 'Authorization failed' ),
               ( 'check_violation.category_name_is_too_long', 400,
                 'Слишком длинное наименование. Максимальная длина - 100 символов', null, null, null ),
               ( 'foreign_key_violation.category_2_category_parent', 400, 'Нельзя удалить категорию с подкатегориями',
                 null, null, null ),
               ( 'check_violation.money_name_is_too_long', 400,
                 'Слишком длинное наименование валюты. Максимальная длина - 10 символов', null, null, null ),
               ( 'unique_violation.money_id_project_name_u', 400, 'Валюта с таким наименованием уже существует', null,
                 null, null ),
               ( 'check_violation.category_name_is_empty', 400, 'Наименование категории не может быть пустым', null,
                 null, null ),
               ( 'foreign_key_violation.cashflow_detail_2_category', 400, 'Найдены транзакции по данной категории',
                 null, null, null ),
               ( 'unique_violation.contractor_id_project_name_u', 400, 'Контрагент с таким именем уже существует', null,
                 null, null ),
               ( 'check_violation.contractor_name_is_empty', 400, 'Наименование контрагента не должно быть пустым',
                 null, null, null ),
               ( 'check_violation.contracor_name_is_too_long', 400,
                 'Слишком длинное наименование. Максимальная длина -100 символов', null, null, null ),
               ( 'foreign_key_violation.cashflow_detail_2_money', 400, 'Найдены транзакции с данной валютой', null,
                 null, null ),
               ( 'check_violation.money_name_is_empty', 400, 'Наименование валюты не должно быть пустым', null, null,
                 null ),
               ( 'check_violation.money_symbol_is_too_long', 400,
                 'Слишком длинное наименовани символа. Максимальная длина - 10 символов', null, null, null ),
               ( 'unique_violation.category_u', 400, 'Категория с таким наименованием уже есть в данной группе', null,
                 null, null ),
               ( 'check_violation.plan_exchange_money_check', 400,
                 'Валюта покупки не должна быть такой же, как валюта продажи', null, null, null );
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_error_v1.down);
  await knex.schema.dropTable('core$.error');
}
