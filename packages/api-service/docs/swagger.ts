import { OpenAPIV3_1 } from 'openapi-types';

import { exchanges } from './exchanges/swagger';
import { header } from './header';
import { planTransactions } from './plan-transactions/swagger';
import { transactions } from './transactions/swagger';
import { transfers } from './transfers/swagger';

const swagger: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    //
    ...(exchanges.tags || []),
    ...(planTransactions.tags || []),
    ...(transactions.tags || []),
    ...(transfers.tags || []),
  ],
  paths: {
    ...exchanges.paths,
    ...planTransactions.paths,
    ...transactions.paths,
    ...transfers.paths,
  },
  components: {
    schemas: {
      ...(exchanges.components?.schemas || {}),
      ...(planTransactions.components?.schemas || {}),
      ...(transactions.components?.schemas || {}),
      ...(transfers.components?.schemas || {}),
    },
    parameters: {
      ...(exchanges.components?.parameters || {}),
      ...(planTransactions.components?.parameters || {}),
      ...(transactions.components?.parameters || {}),
      ...(transfers.components?.parameters || {}),
    },
  },
};

export default swagger;
