import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { createExchangeParamsSchema } from '../../api/v2/exchange/create-exchange/params.schema';
import { createExchangeResponseSchema } from '../../api/v2/exchange/create-exchange/response.schema';
import { deleteExchangeParamsSchema } from '../../api/v2/exchange/delete-exchange/params.schema';
import { exchangeSchema } from '../../api/v2/exchange/exchange.schema';
import { findExchangesParamsSchema } from '../../api/v2/exchange/find-exchanges/params.schema';
import { findExchangesResponseSchema } from '../../api/v2/exchange/find-exchanges/response.schema';
import { getExchangeParamsSchema } from '../../api/v2/exchange/get-exchange/params.schema';
import { getExchangeResponseSchema } from '../../api/v2/exchange/get-exchange/response.schema';
import { updateExchangeParamsSchema } from '../../api/v2/exchange/update-exchange/params.schema';
import { updateExchangeResponseSchema } from '../../api/v2/exchange/update-exchange/response.schema';

const exchanges: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'exchanges',
      description: '',
    },
  ],
  paths: {
    '/exchanges': {
      get: {
        tags: ['exchanges'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: findExchangesParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: findExchangesResponseSchema,
              },
            },
          },
        },
      },
      post: {
        tags: ['exchanges'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: createExchangeParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: createExchangeResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/exchanges/{exchangeId}': {
      get: {
        tags: ['exchanges'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: getExchangeParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: getExchangeResponseSchema,
              },
            },
          },
        },
      },
      patch: {
        tags: ['exchanges'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: updateExchangeParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: updateExchangeResponseSchema,
              },
            },
          },
        },
      },
      delete: {
        tags: ['exchanges'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: deleteExchangeParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          204: {
            description: 'Successful operation',
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
  },
  components: {
    schemas: {
      Exchange: exchangeSchema,
    },
    parameters: {},
  },
};

export { exchanges };
export default exchanges;
