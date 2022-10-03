import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { accountSchema } from '../../api/v2/account/account.schema';
import { createAccountParamsSchema } from '../../api/v2/account/create-account/params.schema';
import { createAccountResponseSchema } from '../../api/v2/account/create-account/response.schema';
import { deleteAccountParamsSchema } from '../../api/v2/account/delete-account/params.schema';
import { getAccountParamsSchema } from '../../api/v2/account/get-account/params.schema';
import { getAccountResponseSchema } from '../../api/v2/account/get-account/response.schema';
import { getAccountsParamsSchema } from '../../api/v2/account/get-accounts/params.schema';
import { getAccountsResponseSchema } from '../../api/v2/account/get-accounts/response.schema';
import { updateAccountParamsSchema } from '../../api/v2/account/update-account/params.schema';
import { updateAccountResponseSchema } from '../../api/v2/account/update-account/response.schema';

const accounts: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'accounts',
      description: '',
    },
  ],
  paths: {
    '/accounts': {
      get: {
        tags: ['accounts'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: getAccountsParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: getAccountsResponseSchema,
              },
            },
          },
        },
      },
      post: {
        tags: ['accounts'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: createAccountParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: createAccountResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/accounts/{accountId}': {
      get: {
        tags: ['accounts'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: getAccountParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: getAccountResponseSchema,
              },
            },
          },
        },
      },
      patch: {
        tags: ['accounts'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: updateAccountParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: updateAccountResponseSchema,
              },
            },
          },
        },
      },
      delete: {
        tags: ['accounts'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: deleteAccountParamsSchema,
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
      Account: accountSchema,
    },
    parameters: {},
  },
};

export { accounts };
export default accounts;
