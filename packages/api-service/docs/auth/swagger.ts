import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { changePasswordParamsSchema } from '../../api/v2/auth/change-password/params.schema';
import { confirmResetPasswordRequestParamsSchema } from '../../api/v2/auth/confirm-reset-password-request/params.schema';
import { confirmResetPasswordRequestResponseSchema } from '../../api/v2/auth/confirm-reset-password-request/response.schema';
import { confirmSignUpRequestParamsSchema } from '../../api/v2/auth/confirm-sign-up-request/params.schema';
import { confirmSignUpRequestResponseSchema } from '../../api/v2/auth/confirm-sign-up-request/response.schema';
import { createSignUpRequestParamsSchema } from '../../api/v2/auth/create-sign-up-request/params.schema';
import { createSignUpRequestResponseSchema } from '../../api/v2/auth/create-sign-up-request/response.schema';
import { resendSignUpConfirmationParamsSchema } from '../../api/v2/auth/resend-sign-up-confirmation/params.schema';
import { resendSignUpConfirmationResponseSchema } from '../../api/v2/auth/resend-sign-up-confirmation/response.schema';
import { resetPasswordRequestParamsSchema } from '../../api/v2/auth/create-reset-password-request/params.schema';
import { resetPasswordRequestResponseSchema } from '../../api/v2/auth/create-reset-password-request/response.schema';
import { sessionSchema } from '../../api/v2/auth/sign-in/response.session.schema';
import { signInParamsSchema } from '../../api/v2/auth/sign-in/params.schema';
import { signInResponseSchema } from '../../api/v2/auth/sign-in/response.schema';
import { signOutParamsSchema } from '../../api/v2/auth/sign-out/params.schema';
import { signOutResponseSchema } from '../../api/v2/auth/sign-out/response.schema';

const auth: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'auth',
      description: '',
    },
  ],
  paths: {
    '/sign-up': {
      post: {
        tags: ['auth'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: createSignUpRequestParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: createSignUpRequestResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/sign-up/:signUpRequestId/resend-confirmation': {
      post: {
        tags: ['auth'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: resendSignUpConfirmationParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: resendSignUpConfirmationResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/sign-up/confirm': {
      post: {
        tags: ['auth'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: confirmSignUpRequestParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: confirmSignUpRequestResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/change-password': {
      post: {
        tags: ['auth'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: changePasswordParamsSchema,
            },
          },
        },
        responses: {
          204: {
            description: 'Successful operation',
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/reset-password': {
      post: {
        tags: ['auth'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: resetPasswordRequestParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: resetPasswordRequestResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/reset-password/confirm': {
      post: {
        tags: ['auth'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: confirmResetPasswordRequestParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: confirmResetPasswordRequestResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/sign-in': {
      post: {
        tags: ['auth'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: signInParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: signInResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
    '/sign-out': {
      post: {
        tags: ['auth'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: signOutParamsSchema,
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: signOutResponseSchema,
              },
            },
          },
        },
      },
    } as OpenAPIV3_1.PathsObject,
  },
  components: {
    schemas: {
      session: sessionSchema,
    },
    parameters: {},
  },
};

export { auth };
export default auth;
