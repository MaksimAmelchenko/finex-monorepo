import { OpenAPIV3 } from 'openapi-types';

import { accountsTypeSchema } from './account-types.schema';
import { accountSchema } from '../../account/account.schema';
import { badgesSchema } from './bages.schema';
import { categoriesSchema } from './categories.schema';
import { categoryPrototypesSchema } from './category-prototypes.schema';
import { contractorsSchema } from './contractors.schema';
import { currenciesSchema } from './currencies.schema';
import { currencyRateSourcesSchema } from './currency-rate-sources.schema';
import { importSourcesSchema } from './import-sources.schema';
import { invitationsSchema } from './invitations.schema';
import { messagesSchema } from './messages.schema';
import { moneysSchema } from './moneys.schema';
import { projectsSchema } from './projects.schema';
import { sessionSchema } from './session.schema';
import { tagsSchema } from './tags.schema';
import { unitsSchema } from './units.schema';
import { usersSchema } from './users.schema';

import { profileSchema } from '../../../../common/schemas/profile.schema';
import { date } from '../../../../common/schemas/fields/date';
import { accountsSchema } from './accounts.schema';

export const getEntitiesResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    messages: messagesSchema,
    session: sessionSchema,
    users: usersSchema,
    currencies: currenciesSchema,
    accountTypes: accountsTypeSchema,
    categoryPrototypes: categoryPrototypesSchema,
    profile: profileSchema,
    projects: projectsSchema,
    importSources: importSourcesSchema,
    currencyRateSources: currencyRateSourcesSchema,
    invitations: invitationsSchema,
    accounts: accountsSchema,
    contractors: contractorsSchema,
    categories: categoriesSchema,
    units: unitsSchema,
    tags: tagsSchema,
    moneys: moneysSchema,
    params: {
      type: 'object',
      properties: {
        dashboard: {
          type: 'object',
          properties: {
            dBegin: date,
            dEnd: date,
          },
          required: ['dBegin', 'dEnd'],
        },
      },
      required: ['dashboard'],
    },
    badges: badgesSchema,
  },
  required: [
    'messages',
    'session',
    'users',
    'currencies',
    'accountTypes',
    'categoryPrototypes',
    'profile',
    'projects',
    'currencyRateSources',
    'contractors',
    'categories',
    'units',
    'tags',
    'moneys',
    'params',
    'badges',
  ],
  additionalProperties: false,
};
