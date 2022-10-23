import { OpenAPIV3_1 } from 'openapi-types';

import { header } from '../header';
import { deleteProfileParamsSchema } from '../../api/v2/profile/delete-profile/params.schema';
import { getProfileParamsSchema } from '../../api/v2/profile/get-profile/params.schema';
import { getProfileResponseSchema } from '../../api/v2/profile/get-profile/response.schema';
import { profileSchema } from '../../api/v2/profile/profile.schema';
import { updateProfileParamsSchema } from '../../api/v2/profile/update-profile/params.schema';
import { updateProfileResponseSchema } from '../../api/v2/profile/update-profile/response.schema';

const profile: OpenAPIV3_1.Document = {
  ...header,
  tags: [
    {
      name: 'profile',
      description: '',
    },
  ],
  paths: {
    '/profile': {
      get: {
        tags: ['profile'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: getProfileParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: getProfileResponseSchema,
              },
            },
          },
        },
      },
      patch: {
        tags: ['profile'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: updateProfileParamsSchema,
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: updateProfileResponseSchema,
              },
            },
          },
        },
      },
      delete: {
        tags: ['profile'],
        summary: '',
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: deleteProfileParamsSchema,
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
  },
  components: {
    schemas: {
      Profile: profileSchema,
    },
    parameters: {},
  },
};

export { profile };
export default profile;
