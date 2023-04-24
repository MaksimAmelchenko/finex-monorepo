import * as moment from 'moment';
import * as i18n from 'i18n';

import { AccountService } from '../../account';
import { ConflictError, GoneError, NotFoundError } from '../../../libs/errors';
import { CurrencyRateSource } from '../../../types/currency-rate-source';
import { Household } from '../../household';
import { IHousehold } from '../../../types/household';
import { IRequestContext } from '../../../types/app';
import { ISignUpRequest } from '../../../types/sign-up-request';
import { Project } from '../../project/model/project';
import { ProjectService } from '../../project';
import { SignUpRequestGateway } from '../gateway';
import { SubscriptionStatus } from '../../../modules/billing/subscription/types';
import { accessPeriodService } from '../../../modules/billing/access-period/access-period.service';
import { planService } from '../../../modules/billing/plan/plan.service';
import { subscriptionRepository } from '../../../modules/billing/subscription/subscription.repository';
import { userRepository } from '../../../modules/user/user.repository';

export async function confirmSignUpRequest(ctx: IRequestContext<unknown, true>, token: string): Promise<void> {
  const signUpRequest: ISignUpRequest | undefined = await SignUpRequestGateway.getByToken(ctx, token);
  if (!signUpRequest) {
    throw new NotFoundError('Token not found');
  }

  if (signUpRequest.confirmedAt) {
    throw new GoneError(`The registration has already been confirmed`);
  }

  // checks
  const userCheck = await userRepository.getUserByUsername(ctx, signUpRequest.email);

  if (userCheck) {
    throw new ConflictError('This email already registered');
  }

  const household: IHousehold = await Household.create(ctx);

  const user = await userRepository.createUser(ctx, {
    name: signUpRequest.name,
    email: signUpRequest.email,
    password: signUpRequest.password,
    householdId: String(household.id),
    currencyRateSourceId: String(CurrencyRateSource.OpenExchangeRates),
  });

  const userId: string = String(user.idUser);
  const project: Project = await ProjectService.createProject(ctx, userId, {
    name: i18n.__({ phrase: 'defaults.projectName', locale: ctx.params.locale }),
  });
  const projectId: string = String(project.idProject);
  await userRepository.updateUser(ctx, userId, { projectId });

  await SignUpRequestGateway.update(ctx, signUpRequest.id, {
    confirmed_at: new Date().toISOString(),
  });

  // create the first account to make life easier
  await AccountService.createAccount(ctx, projectId, userId, {
    accountTypeId: '1',
    name: i18n.__({ phrase: 'defaults.accountName', locale: ctx.params.locale }),
  });

  const plan = await planService.getPlan(ctx, 'trial');

  await subscriptionRepository.createSubscription(ctx, userId, {
    planId: plan.id,
    status: SubscriptionStatus.Active,
  });

  await accessPeriodService.createAccessPeriod(ctx, userId, {
    planId: plan.id,
    startAt: new Date().toISOString(),
    endAt: moment.utc().add(moment.duration(plan.duration)).toISOString(),
  });
}
