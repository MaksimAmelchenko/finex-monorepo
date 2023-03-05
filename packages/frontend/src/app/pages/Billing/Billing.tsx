import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { BillingRepository } from '../../stores/billing-repository';
import { Form, FormButton } from '../../components/Form';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { Loader } from '../../components/Loader/Loader';
import { Locale } from '../../types';
import { PayPalButton } from './PayPalButton/PayPalButton';
import { Plan } from '../../types/billing';
import { PlanCard } from './PlanCard/PlanCard';
import { ProfileRepository } from '../../stores/profile-repository';
import { YooKassaButton } from './YooKassaButton/YooKassaButton';
import { currentLocale, formatDate, getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import { default as financialManagementSvg } from './assets/financial-management.svg';

import styles from './Billing.module.scss';

const localeCurrencyMap: Record<Locale, string> = {
  [Locale.En]: 'EUR',
  [Locale.De]: 'EUR',
  [Locale.Ru]: 'RUB',
};

const t = getT('Billing');

export const Billing = observer(() => {
  const profileRepository = useStore(ProfileRepository);
  const billingRepository = useStore(BillingRepository);

  const { enqueueSnackbar } = useSnackbar();
  const [plans, setPlans] = useState<Plan[]>([]);

  const { profile } = profileRepository;

  useEffect(() => {
    billingRepository.getPlans().then(plans => {
      setPlans(plans);
    });
  }, []);

  useEffect(() => {
    return () => {
      billingRepository.stopPolling();
    };
  }, [billingRepository]);

  const currentPlan = plans.find(plan => plan.id === profile?.planId);

  const availablePlans = plans.filter(
    ({ id, price, isEnabled, currency }) =>
      (price && isEnabled && currency === localeCurrencyMap[currentLocale() as Locale]) ||
      (id === currentPlan?.id && price)
  );

  const onAfter = async () => {
    return profileRepository.getProfile().then(() => {
      enqueueSnackbar(t('Subscription successful'), { variant: 'success' });
    });
  };

  const handleUnsubscribe = async () => {
    return billingRepository.cancelSubscription().then(() => profileRepository.getProfile());
  };

  const handlePayNow = async () => {};

  if (!plans.length) {
    return <Loader />;
  }

  if (!profile) {
    return <Loader />;
  }

  const isExpired = parseISO(profile.accessUntil) < new Date();
  const isFreeSubscription = currentPlan?.id === 'free';

  return (
    <>
      <div className={styles.layout}>
        <HeaderLayout title={t('Billing settings')} className={styles.header} />
        <main className={styles.content}>
          <section className={styles.currentPlanInfo}>
            {!isFreeSubscription && (
              <div>
                {t('Access until')}:{' '}
                <span
                  className={clsx(
                    styles.currentPlanInfo__accessUntil,
                    isExpired && styles.currentPlanInfo__accessUntil__expired
                  )}
                >
                  {formatDate(profile.accessUntil)}
                </span>
              </div>
            )}
            <div>
              {currentPlan ? (
                <>
                  {t('Your plan')}: <span className={styles.currentPlanInfo__name}>{currentPlan.name}</span>
                </>
              ) : (
                <span className={clsx(styles.currentPlanInfo__name, styles.currentPlanInfo__name_noSubscription)}>
                  {t('No active subscription')}
                </span>
              )}
            </div>
          </section>

          {!isFreeSubscription ? (
            <section className={styles.priceSection}>
              {availablePlans.map(plan => {
                const { id, availablePaymentGateways } = plan;
                const isCurrentPlan = id === currentPlan?.id;
                const isExpired = isCurrentPlan && parseISO(profile.accessUntil) < new Date() && false;

                return (
                  <PlanCard plan={plan} className={styles.priceSection__priceCard} key={plan.id}>
                    {!isCurrentPlan ? (
                      <div className={styles.priceSection__priceCardButtons}>
                        {availablePaymentGateways.includes('yookassa') && (
                          <YooKassaButton plan={plan} onAfter={onAfter} />
                        )}
                        {availablePaymentGateways.includes('paypal') && <PayPalButton plan={plan} onAfter={onAfter} />}
                      </div>
                    ) : (
                      <>
                        <Form
                          onSubmit={handleUnsubscribe}
                          initialValues={{}}
                          className={styles.root__form}
                          name="unsubscription"
                        >
                          <FormButton type="submit" color="danger" className={styles.root__button}>
                            {t('Unsubscribe')}
                          </FormButton>
                        </Form>

                        {isExpired && (
                          <Form onSubmit={handlePayNow} initialValues={{}} className={styles.root__form} name="payNow">
                            <FormButton
                              type="submit"
                              variant="secondaryGray"
                              color="primary"
                              fullSize
                              className={styles.root__button}
                            >
                              {t('Pay Now')}
                            </FormButton>
                          </Form>
                        )}
                      </>
                    )}
                  </PlanCard>
                );
              })}
            </section>
          ) : (
            <div className={clsx(styles.content__freeSubscriptionImage, styles.freeSubscriptionImage)}>
              <img
                className={styles.freeSubscriptionImage__image}
                src={financialManagementSvg}
                alt="Financial management"
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
});

export default Billing;
