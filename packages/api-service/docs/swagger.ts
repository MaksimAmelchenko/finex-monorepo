import { OpenAPIV3_1 } from 'openapi-types';

import { accounts } from './accounts/swagger';
import { auth } from './auth/swagger';
import { cashFlowItems } from './cashflow-items/swagger';
import { cashFlows } from './cashflows/swagger';
import { exchanges } from './exchanges/swagger';
import { header } from './header';
import { planTransactions } from './plan-transactions/swagger';
import { profile } from './profile/swagger';
import { reports } from './reports/swagger';
import { transactions } from './transactions/swagger';
import { transfers } from './transfers/swagger';

const swagger: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    //
    ...(accounts.tags || []),
    ...(auth.tags || []),
    ...(cashFlowItems.tags || []),
    ...(cashFlows.tags || []),
    ...(exchanges.tags || []),
    ...(planTransactions.tags || []),
    ...(profile.tags || []),
    ...(reports.tags || []),
    ...(transactions.tags || []),
    ...(transfers.tags || []),
  ],
  paths: {
    ...accounts.paths,
    ...auth.paths,
    ...cashFlowItems.paths,
    ...cashFlows.paths,
    ...exchanges.paths,
    ...planTransactions.paths,
    ...profile.paths,
    ...reports.paths,
    ...transactions.paths,
    ...transfers.paths,
  },
  components: {
    schemas: {
      ...(accounts.components?.schemas || {}),
      ...(auth.components?.schemas || {}),
      ...(cashFlowItems.components?.schemas || {}),
      ...(cashFlows.components?.schemas || {}),
      ...(exchanges.components?.schemas || {}),
      ...(planTransactions.components?.schemas || {}),
      ...(profile.components?.schemas || {}),
      ...(reports.components?.schemas || {}),
      ...(transactions.components?.schemas || {}),
      ...(transfers.components?.schemas || {}),
    },
    parameters: {
      ...(accounts.components?.parameters || {}),
      ...(auth.components?.parameters || {}),
      ...(cashFlowItems.components?.parameters || {}),
      ...(cashFlows.components?.parameters || {}),
      ...(exchanges.components?.parameters || {}),
      ...(planTransactions.components?.parameters || {}),
      ...(profile.components?.parameters || {}),
      ...(reports.components?.parameters || {}),
      ...(transactions.components?.parameters || {}),
      ...(transfers.components?.parameters || {}),
    },
  },
};

export default swagger;
