import { OpenAPIV3_1 } from 'openapi-types';

const pkg = require('../package.json');

export const header: Pick<OpenAPIV3_1.Document, 'openapi' | 'info' | 'servers'> = {
  openapi: '3.1.0',
  info: {
    title: 'FINEX.io Swagger',
    description: '',
    contact: { email: 'dev@finex.io' },
    version: pkg.version,
  },
  servers: [
    {
      url: 'https://finex.io/api/{basePath}',
      variables: {
        basePath: {
          default: 'v1',
        },
      },
    },
  ],
};
