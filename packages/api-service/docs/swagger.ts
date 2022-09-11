import { OpenAPIV3_1 } from 'openapi-types';

import { exchanges } from './exchanges/swagger';
import { header } from './header';
import { transfers } from './transfers/swagger';

const swagger: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    //
    ...(exchanges.tags || []),
    ...(transfers.tags || []),
  ],
  paths: {
    ...exchanges.paths,
    ...transfers.paths,
  },
  components: {
    schemas: {
      ...(exchanges.components?.schemas || {}),
      ...(transfers.components?.schemas || {}),
    },
    parameters: {
      ...(exchanges.components?.parameters || {}),
      ...(transfers.components?.parameters || {}),
    },
  },
};

export default swagger;
