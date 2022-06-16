import { handler } from './handler';
import { RestMethod, RestRouteOptions } from '../../../../libs/rest-api/types';
import { updateProjectParamsSchema } from './params.schema';
import { updateProjectResponseSchema } from './response.schema';

export const updateProject: RestRouteOptions = {
  methods: [RestMethod.Post, RestMethod.Patch],
  uri: '/v2/projects/:projectId',
  handler,
  schemas: {
    params: updateProjectParamsSchema,
    response: updateProjectResponseSchema,
  },
};
