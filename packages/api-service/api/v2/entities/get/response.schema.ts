import { OpenAPIV3_1 } from 'openapi-types';

import { accountsSchema } from './accounts.schema';
import { accountsTypeSchema } from './account-types.schema';
import { badgesSchema } from './bages.schema';
import { categoriesSchema } from './categories.schema';
import { categoryPrototypesSchema } from './category-prototypes.schema';
import { contractorsSchema } from './contractors.schema';
import { currenciesSchema } from './currencies.schema';
import { currencyRateSourcesSchema } from './currency-rate-sources.schema';
import { date } from '../../../../common/schemas/fields/date';
import { importSourcesSchema } from './import-sources.schema';
import { invitationsSchema } from './invitations.schema';
import { messagesSchema } from './messages.schema';
import { moneysSchema } from './moneys.schema';
import { profileSchema } from '../../profile/profile.schema';
import { projectsSchema } from './projects.schema';
import { sessionSchema } from './session.schema';
import { tagsSchema } from './tags.schema';
import { unitsSchema } from './units.schema';
import { usersSchema } from './users.schema';

export const getEntitiesResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    // messages: messagesSchema,
    session: sessionSchema,
    users: usersSchema,
    currencies: currenciesSchema,
    accountTypes: accountsTypeSchema,
    categoryPrototypes: categoryPrototypesSchema,
    profile: profileSchema,
    projects: projectsSchema,
    // importSources: importSourcesSchema,
    // currencyRateSources: currencyRateSourcesSchema,
    // invitations: invitationsSchema,
    accounts: accountsSchema,
    contractors: contractorsSchema,
    categories: categoriesSchema,
    units: unitsSchema,
    tags: tagsSchema,
    moneys: moneysSchema,
    params: {
      type: 'object',
      properties: {
        outcome: {
          type: 'object',
          properties: {
            accountDailyBalances: {
              type: 'object',
              properties: {
                startDate: date,
                endDate: date,
              },
              required: ['startDate', 'endDate'],
            },
          },
          required: ['accountDailyBalances'],
        },
      },
      required: ['outcome'],
    },
    badges: badgesSchema,
  },
  additionalProperties: false,
  required: [
    'accountTypes',
    'badges',
    'categories',
    'categoryPrototypes',
    'contractors',
    'currencies',
    // 'currencyRateSources',
    'moneys',
    'params',
    'profile',
    'projects',
    'session',
    'tags',
    'units',
    'users',
  ],
};
