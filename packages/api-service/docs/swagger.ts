import { OpenAPIV3_1 } from 'openapi-types';

import { transfers } from './transfers/swagger';
import { header } from './header';

const swagger: OpenAPIV3_1.Document = {
  ...header,
  tags: [...(transfers.tags || [])],
  paths: {
    ...transfers.paths,
  },
  components: {
    schemas: {
      ...(transfers.components?.schemas || {}),
    },
    parameters: {
      ...(transfers.components?.parameters || {}),
    },
  },
};

export default swagger;
