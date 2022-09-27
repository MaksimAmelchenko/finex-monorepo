import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { createPlanTransactionParamsSchema } from '../../api/v2/plan-transaction/create-plan-transaction/params.schema';
import { createPlanTransactionResponseSchema } from '../../api/v2/plan-transaction/create-plan-transaction/response.schema';
import { deletePlanTransactionParamsSchema } from '../../api/v2/plan-transaction/delete-plan-transaction/params.schema';
import { getPlanTransactionsParamsSchema } from '../../api/v2/plan-transaction/get-plan-transactions/params.schema';
import { getPlanTransactionsResponseSchema } from '../../api/v2/plan-transaction/get-plan-transactions/response.schema';
import { planTransactionSchema } from '../../api/v2/plan-transaction/plan-transaction.schema';
import { updatePlanTransactionParamsSchema } from '../../api/v2/plan-transaction/update-plan-transaction/params.schema';
import { updatePlanTransactionResponseSchema } from '../../api/v2/plan-transaction/update-plan-transaction/response.schema';

const planTransactions: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'plan-transactions',
      description: '',
    },
  ],
  paths: {
    '/plan-transactions': {
      get: {
        tags: ['plan-transactions'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: getPlanTransactionsParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: getPlanTransactionsResponseSchema,
              },
            },
          },
        },
      },
      post: {
        tags: ['plan-transactions'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: createPlanTransactionParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: createPlanTransactionResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/plan-transactions/{planId}': {
      patch: {
        tags: ['plan-transactions'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: updatePlanTransactionParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: updatePlanTransactionResponseSchema,
              },
            },
          },
        },
      },
      delete: {
        tags: ['plan-transactions'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: deletePlanTransactionParamsSchema,
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
      PlanTransaction: planTransactionSchema,
    },
    parameters: {},
  },
};

export { planTransactions };
export default planTransactions;
