import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { createTransferParamsSchema } from '../../api/v2/transfer/create-transfer/params.schema';
import { createTransferResponseSchema } from '../../api/v2/transfer/create-transfer/response.schema';
import { deleteTransferParamsSchema } from '../../api/v2/transfer/delete-transfer/params.schema';
import { findTransfersParamsSchema } from '../../api/v2/transfer/find-transfers/params.schema';
import { findTransfersResponseSchema } from '../../api/v2/transfer/find-transfers/response.schema';
import { getTransferParamsSchema } from '../../api/v2/transfer/get-transfer/params.schema';
import { getTransferResponseSchema } from '../../api/v2/transfer/get-transfer/response.schema';
import { transferSchema } from '../../api/v2/transfer/transfer.schema';
import { updateTransferParamsSchema } from '../../api/v2/transfer/update-transfer/params.schema';
import { updateTransferResponseSchema } from '../../api/v2/transfer/update-transfer/response.schema';

const transfers: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'transfers',
      description: '',
    },
  ],
  paths: {
    '/transfers': {
      get: {
        tags: ['transfers'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: findTransfersParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: findTransfersResponseSchema,
              },
            },
          },
        },
      },
      post: {
        tags: ['transfers'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: createTransferParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: createTransferResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/transfers/{transferId}': {
      get: {
        tags: ['transfers'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: getTransferParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: getTransferResponseSchema,
              },
            },
          },
        },
      },
      patch: {
        tags: ['transfers'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: updateTransferParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: updateTransferResponseSchema,
              },
            },
          },
        },
      },
      delete: {
        tags: ['transfers'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: deleteTransferParamsSchema,
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
      Transfer: transferSchema,
    },
    parameters: {},
  },
};

export { transfers };
export default transfers;
