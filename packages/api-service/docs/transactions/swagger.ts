import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { createTransactionParamsSchema } from '../../api/v2/transaction/create-transaction/params.schema';
import { createTransactionResponseSchema } from '../../api/v2/transaction/create-transaction/response.schema';
import { deleteTransactionParamsSchema } from '../../api/v2/transaction/delete-transaction/params.schema';
import { findTransactionsParamsSchema } from '../../api/v2/transaction/find-transactions/params.schema';
import { findTransactionsResponseSchema } from '../../api/v2/transaction/find-transactions/response.schema';
import { plannedTransactionSchema } from '../../api/v2/transaction/planned-transaction.schema';
import { transactionSchema } from '../../api/v2/transaction/transaction.schema';
import { updateTransactionParamsSchema } from '../../api/v2/transaction/update-transaction/params.schema';
import { updateTransactionResponseSchema } from '../../api/v2/transaction/update-transaction/response.schema';

const transactions: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'transactions',
      description: '',
    },
  ],
  paths: {
    '/transactions': {
      get: {
        tags: ['transactions'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: findTransactionsParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: findTransactionsResponseSchema,
              },
            },
          },
        },
      },
      post: {
        tags: ['transactions'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: createTransactionParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: createTransactionResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/transactions/{transactionId}': {
      patch: {
        tags: ['transactions'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: updateTransactionParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: updateTransactionResponseSchema,
              },
            },
          },
        },
      },
      delete: {
        tags: ['transactions'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: deleteTransactionParamsSchema,
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
      Transaction: transactionSchema,
      PlannedTransaction: plannedTransactionSchema,
    },
    parameters: {},
  },
};

export { transactions };
export default transactions;
