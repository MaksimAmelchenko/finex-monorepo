import { OpenAPIV3_1 } from 'openapi-types';

import { accounts } from './accounts/swagger';
import { exchanges } from './exchanges/swagger';
import { header } from './header';
import { planTransactions } from './plan-transactions/swagger';
import { reports } from './reports/swagger';
import { transactions } from './transactions/swagger';
import { transfers } from './transfers/swagger';

const swagger: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    //
    ...(accounts.tags || []),
    ...(exchanges.tags || []),
    ...(planTransactions.tags || []),
    ...(reports.tags || []),
    ...(transactions.tags || []),
    ...(transfers.tags || []),
  ],
  paths: {
    ...accounts.paths,
    ...exchanges.paths,
    ...planTransactions.paths,
    ...reports.paths,
    ...transactions.paths,
    ...transfers.paths,
  },
  components: {
    schemas: {
      ...(accounts.components?.schemas || {}),
      ...(exchanges.components?.schemas || {}),
      ...(planTransactions.components?.schemas || {}),
      ...(reports.components?.schemas || {}),
      ...(transactions.components?.schemas || {}),
      ...(transfers.components?.schemas || {}),
    },
    parameters: {
      ...(accounts.components?.parameters || {}),
      ...(exchanges.components?.parameters || {}),
      ...(planTransactions.components?.parameters || {}),
      ...(reports.components?.parameters || {}),
      ...(transactions.components?.parameters || {}),
      ...(transfers.components?.parameters || {}),
    },
  },
};

export default swagger;
