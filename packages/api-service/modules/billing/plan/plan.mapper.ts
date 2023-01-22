import * as moment from 'moment';

import { IPlan, IPlanDAO, IPlanDTO, PlanMapper } from './types';
import { Locale } from '../../../types/app';
import { Plan } from './models/plan';
import { t } from '../../../libs/t';

class PlanMapperImpl implements PlanMapper {
  toDomain(plan: IPlanDAO): IPlan {
    const {
      id,
      name,
      description,
      productName,
      duration,
      price,
      currency,
      isEnabled,
      isRenewable,
      availablePaymentGateways,
      paypalPlanId,
      createdAt,
      updatedAt,
    } = plan;

    return new Plan({
      id,
      name,
      description,
      productName,
      duration,
      price,
      currency,
      isEnabled,
      isRenewable,
      availablePaymentGateways,
      paypalPlanId,
      createdAt,
      updatedAt,
    });
  }

  toDTO(plan: IPlan, locale: Locale): IPlanDTO {
    const {
      id,
      name,
      price,
      currency,
      description,
      duration,
      isEnabled,
      isRenewable,
      availablePaymentGateways,
      paypalPlanId,
    } = plan;

    return {
      id,
      name: t(name, locale),
      description: t(description, locale),
      duration: moment.duration(duration).locale(locale).humanize(),
      price,
      currency,
      isEnabled,
      isRenewable,
      availablePaymentGateways,
      paypalPlanId,
    };
  }
}

export const planMapper = new PlanMapperImpl();
