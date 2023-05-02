import { OpenAPIV3_1 } from 'openapi-types';

import { date } from '../../../common/schemas/fields/date';

export const planExcludeDAOSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    idProject: {
      type: 'integer',
    },
    idPlan: {
      type: 'integer',
    },
    idUser: {
      type: 'integer',
    },
    dexclude: date,
    actionType: {
      type: 'integer',
    },
  },
  additionalProperties: false,
  required: [
    //
    'idProject',
    'idPlan',
    'idUser',
    'dexclude',
    'actionType',
  ],
};
