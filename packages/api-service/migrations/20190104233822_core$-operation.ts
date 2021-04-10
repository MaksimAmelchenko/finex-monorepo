import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').createTable('operation', table => {
    table.comment('Операция');
    table.integer('id_operation').primary('operation_pk');
    table.text('name').notNullable().unique('operation_name_u');
    table.text('method').notNullable();
    table.boolean('is_enabled').notNullable().defaultTo(true);
    table.boolean('is_need_authorize').notNullable().defaultTo(true);
  });

  await knex.schema.raw(`
        insert
          into core$.operation ( id_operation, name, method, is_enabled, is_need_authorize )
        values ( 48, 'core.user.get', 'core$_user.get', true, true ),
               ( 49, 'cf.project.get', 'cf$_project.get', true, true ),
               ( 50, 'cf.project.create', 'cf$_project.create', true, true ),
               ( 52, 'cf.project.update', 'cf$_project.update', true, true ),
               ( 53, 'cf.project.destroy', 'cf$_project.destroy', true, true ),
               ( 58, 'cf.profile.get', 'cf$_profile.get', true, true ),
               ( 59, 'cf.profile.update', 'cf$_profile.update', true, true ),
               ( 60, 'cf.tag.get', 'cf$_tag.get', true, true ),
               ( 61, 'cf.tag.update', 'cf$_tag.update', true, true ),
               ( 62, 'cf.tag.destroy', 'cf$_tag.destroy', true, true ),
               ( 63, 'cf.tag.create', 'cf$_tag.create', true, true ),
               ( 64, 'cf.entity.get', 'cf$_entity.get', true, true ),
               ( 65, 'cf.project.use', 'cf$_project.use', true, true ),
               ( 67, 'cf.project.copy', 'cf$_project.copy', true, true ),
               ( 69, 'cf.project.merge', 'cf$_project.merge', true, true ),
               ( 70, 'cf.report.dynamics', 'cf$_report.dynamics', true, true ),
               ( 71, 'cf.report.distribution', 'cf$_report.distribution', true, true ),
               ( 72, 'cf.account.balance', 'cf$_account.balance', true, true ),
               ( 73, 'cf.account.balance_daily', 'cf$_account.balance_daily', true, true ),
               ( 12, 'cf.currency.upload', 'cf$_currency.upload', true, false ),
               ( 74, 'core.user.signup', 'core$_auth.signup', true, false ),
               ( 1, 'core.user.signin', 'core$_auth.authenticate', true, false ),
               ( 4, 'core.user.signup.confirm', 'core$_auth.signup_confirm', true, false ),
               ( 75, 'core.user.password_recovery', 'core$_auth.password_recovery', true, false ),
               ( 76, 'core.user.password_recovery.confirm', 'core$_auth.password_recovery_confirm', true, false ),
               ( 8, 'cf.import', 'cf$_import.do', true, true ),
               ( 5, 'core.file.getNextFile', 'core$_file.get_Next_File', true, true ),
               ( 11, 'cf.currency.get', 'cf$_currency.get', true, true ),
               ( 15, 'cf.account.get', 'cf$_account.get', true, true ),
               ( 16, 'cf.ie.get', 'cf$_ie.get', true, true ),
               ( 6, 'core.file.put', 'core$_file.put', true, true ),
               ( 17, 'cf.unit.get', 'cf$_unit.get', true, true ),
               ( 7, 'cf.importSource.get', 'cf$_import_Source.get', true, true ),
               ( 19, 'cf.ie.update', 'cf$_ie.update', true, true ),
               ( 20, 'cf.ie.destroy', 'cf$_ie.destroy', true, true ),
               ( 18, 'cf.ie.create', 'cf$_ie.create', true, true ),
               ( 23, 'cf.debt.get', 'cf$_debt.get', true, true ),
               ( 24, 'cf.debt.update', 'cf$_debt.update', true, true ),
               ( 25, 'cf.debt.create', 'cf$_debt.create', true, true ),
               ( 26, 'cf.debt.destroy', 'cf$_debt.destroy', true, true ),
               ( 27, 'cf.transfer.create', 'cf$_transfer.create', true, true ),
               ( 28, 'cf.transfer.get', 'cf$_transfer.get', true, true ),
               ( 29, 'cf.transfer.update', 'cf$_transfer.update', true, true ),
               ( 30, 'cf.transfer.destroy', 'cf$_transfer.destroy', true, true ),
               ( 34, 'cf.exchange.create', 'cf$_exchange.create', true, true ),
               ( 35, 'cf.exchange.update', 'cf$_exchange.update', true, true ),
               ( 36, 'cf.exchange.get', 'cf$_exchange.get', true, true ),
               ( 37, 'cf.exchange.destroy', 'cf$_exchange.destroy', true, true ),
               ( 39, 'cf.account.create', 'cf$_account.create', true, true ),
               ( 40, 'cf.account.update', 'cf$_account.update', true, true ),
               ( 41, 'cf.account.destroy', 'cf$_account.destroy', true, true ),
               ( 45, 'cf.unit.create', 'cf$_unit.create', true, true ),
               ( 46, 'cf.unit.update', 'cf$_unit.update', true, true ),
               ( 47, 'cf.unit.destroy', 'cf$_unit.destroy', true, true ),
               ( 42, 'cf.contractor.create', 'cf$_contractor.create', true, true ),
               ( 44, 'cf.contractor.destroy', 'cf$_contractor.destroy', true, true ),
               ( 13, 'cf.contractor.get', 'cf$_contractor.get', true, true ),
               ( 43, 'cf.contractor.update', 'cf$_contractor.update', true, true ),
               ( 78, 'cf.invitation.reject', 'cf$_invitation.reject', true, true ),
               ( 79, 'cf.invitation.accept', 'cf$_invitation.accept', true, true ),
               ( 80, 'cf.invitation.get', 'cf$_invitation.get', true, true ),
               ( 10, 'cf.user.migrate', 'core$_user.migrate', true, false ),
               ( 77, 'cf.invitation.create', 'cf$_invitation.create', true, false ),
               ( 2, 'core.session.get', 'core$_session.get', true, true ),
               ( 81, 'cf.money.get', 'cf$_money.get', true, true ),
               ( 82, 'cf.money.create', 'cf$_money.create', true, true ),
               ( 83, 'cf.money.update', 'cf$_money.update', true, true ),
               ( 84, 'cf.money.destroy', 'cf$_money.destroy', true, true ),
               ( 85, 'cf.money.sort', 'cf$_money.sort', true, true ),
               ( 54, 'cf.category.create', 'cf$_category.create', true, true ),
               ( 56, 'cf.category.destroy', 'cf$_category.destroy', true, true ),
               ( 14, 'cf.category.get', 'cf$_category.get', true, true ),
               ( 57, 'cf.category.move', 'cf$_category.move', true, true ),
               ( 55, 'cf.category.update', 'cf$_category.update', true, true ),
               ( 9, 'cf.dashboard.balances', 'cf$_dashboard.balances', true, true ),
               ( 21, 'cf.ieDetail.get', 'cf$_ie_item.get', true, true ),
               ( 22, 'cf.ieDetail.update', 'cf$_ie_item.update', true, true ),
               ( 31, 'cf.ieDetail.destroy', 'cf$_ie_item.destroy', true, true ),
               ( 33, 'cf.ieDetail.create', 'cf$_ie_item.create', true, true ),
               ( 86, 'cf.planCashFlowItem.get', 'cf$_plan_cashflow_item.get', true, true ),
               ( 87, 'cf.planCashFlowItem.create', 'cf$_plan_cashflow_item.create', true, true ),
               ( 88, 'cf.planCashFlowItem.update', 'cf$_plan_cashflow_item.update', true, true ),
               ( 89, 'cf.planCashFlowItem.destroy', 'cf$_plan_cashflow_item.destroy', true, true ),
               ( 90, 'cf.plan.cancel', 'cf$_plan.cancel', true, true ),
               ( 91, 'cf.planTransfer.get', 'cf$_plan_transfer.get', true, true ),
               ( 92, 'cf.planTransfer.create', 'cf$_plan_transfer.create', true, true ),
               ( 93, 'cf.planTransfer.update', 'cf$_plan_transfer.update', true, true ),
               ( 94, 'cf.planTransfer.destroy', 'cf$_plan_transfer.destroy', true, true ),
               ( 95, 'cf.planExchange.get', 'cf$_plan_exchange.get', true, true ),
               ( 96, 'cf.planExchange.create', 'cf$_plan_exchange.create', true, true ),
               ( 97, 'cf.planExchange.update', 'cf$_plan_exchange.update', true, true ),
               ( 98, 'cf.planExchange.destroy', 'cf$_plan_exchange.destroy', true, true );
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.operation');
}
