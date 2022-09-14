import { OpenAPIV3_1 } from 'openapi-types';

import { exchanges } from './exchanges/swagger';
import { header } from './header';
import { transactions } from './transactions/swagger';
import { transfers } from './transfers/swagger';

const swagger: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    //
    ...(exchanges.tags || []),
    ...(transactions.tags || []),
    ...(transfers.tags || []),
  ],
  paths: {
    ...exchanges.paths,
    ...transactions.paths,
    ...transfers.paths,
  },
  components: {
    schemas: {
      ...(exchanges.components?.schemas || {}),
      ...(transactions.components?.schemas || {}),
      ...(transfers.components?.schemas || {}),
    },
    parameters: {
      ...(exchanges.components?.parameters || {}),
      ...(transactions.components?.parameters || {}),
      ...(transfers.components?.parameters || {}),
    },
  },
};

export default swagger;
