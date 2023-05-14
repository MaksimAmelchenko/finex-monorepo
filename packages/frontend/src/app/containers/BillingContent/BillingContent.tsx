import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { BillingRepository } from '../../stores/billing-repository';
import { Container } from '../../components/Container/Container';
import { FAQSection, IFAQItem } from '../../components/FAQSection/FAQSection';
import { Form, FormButton } from '../../components/Form';
import { Loader } from '../../components/Loader/Loader';
import { Locale } from '../../types';
import { PayPalButton } from './PayPalButton/PayPalButton';
import { Plan } from '../../types/billing';
import { PriceCard } from './PriceCard/PriceCard';
import { ProfileRepository } from '../../stores/profile-repository';
import { YooKassaButton } from './YooKassaButton/YooKassaButton';
import { currentLocale, formatDate, getT, toCurrency } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import { default as financialManagementSvg } from '../../containers/BillingContent/assets/financial-management.svg';

import styles from './BillingContent.module.scss';
import { Link } from '../../components/Link/Link';

const localeCurrencyMap: Record<Locale, string> = {
  [Locale.En]: 'EUR',
  [Locale.De]: 'EUR',
  [Locale.Ru]: 'RUB',
};

const currencyUnitMap: Record<string, string> = {
  EUR: '€',
  RUB: '₽',
  USD: '$',
};

const t = getT('Billing');

export const BillingContent = observer(() => {
  const profileRepository = useStore(ProfileRepository);
  const billingRepository = useStore(BillingRepository);

  const { enqueueSnackbar } = useSnackbar();
  const [plans, setPlans] = useState<Plan[]>([]);
  const locale = currentLocale();
  const { profile } = profileRepository;

  const faqItems: IFAQItem[] = [
    {
      question: t('What subscription plans are available at FINEX?'),
      answer: t(
        'We offer two subscription plans: monthly and yearly. The yearly plan allows you to save 20% compared to the monthly subscription'
      ),
    },
    {
      question: t('Can I cancel my subscription at any time?'),
      answer: t(
        'Yes, you can cancel your subscription at any time. However, please note that changes will only take effect after the completion of the already paid term.'
      ),
    },
    {
      question: t('Can I switch between plans?'),
      answer: t(
        'Yes, you can switch between the plans at any time. Changes will only take effect after the end of your current billing period.'
      ),
    },
    {
      question: t('Do you offer a free trial?'),
      answer: t(
        'Yes, we offer a 14-day free trial. It has full functionality and does not differ from the paid version in any way.'
      ),
    },
    {
      question: t('What happens after my 14-day free trial ends?'),
      answer: t(
        'If you do not choose a plan during your free trial, you will be placed on a read-only plan. This means you can view your data, but you will not be able to add or edit anything until you subscribe to a paid plan.'
      ),
    },
    {
      question: t('Can I get a refund if I cancel my subscription before the end of the paid term?'),
      answer: t(
        'Unfortunately, we do not offer refunds for any unused portion of your subscription term. Once you cancel, you will have access to your subscription plan until the end of your current paid term.'
      ),
    },
  ];

  useEffect(() => {
    billingRepository.getPlans().then(plans => {
      setPlans(plans);
    });
  }, [billingRepository]);

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

  if (isFreeSubscription) {
    return (
      <main className={styles.root}>
        <div className={clsx(styles.root__freeSubscriptionImage, styles.freeSubscriptionImage)}>
          <img
            className={styles.freeSubscriptionImage__image}
            src={financialManagementSvg}
            alt="Financial management"
          />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.root}>
      <section className={styles.currentPlanInfo}>
        <Container>
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
        </Container>
      </section>

      <section className={styles.priceSection}>
        <Container className={styles.priceSection__priceCards}>
          {availablePlans.map(plan => {
            const { id, name, description, price, currency, availablePaymentGateways } = plan;
            const isCurrentPlan = id === currentPlan?.id;
            const isExpired = isCurrentPlan && parseISO(profile.accessUntil) < new Date() && false;

            return (
              <PriceCard
                title={name}
                description={description}
                price={toCurrency(price!, {
                  unit: currencyUnitMap[currency!],
                  precision: 2,
                  strip_insignificant_zeros: false,
                })}
                className={styles.priceSection__priceCard}
                key={id}
              >
                {!isCurrentPlan ? (
                  <>
                    {availablePaymentGateways.includes('yookassa') && <YooKassaButton plan={plan} onAfter={onAfter} />}
                    {availablePaymentGateways.includes('paypal') && <PayPalButton plan={plan} onAfter={onAfter} />}
                  </>
                ) : (
                  <>
                    <Form
                      onSubmit={handleUnsubscribe}
                      initialValues={{}}
                      className={styles.root__form}
                      name="unsubscription"
                    >
                      <FormButton type="submit" size="xl" color="danger" fullSize className={styles.root__button}>
                        {t('Unsubscribe')}
                      </FormButton>
                    </Form>

                    {isExpired && (
                      <Form onSubmit={handlePayNow} initialValues={{}} className={styles.root__form} name="payNow">
                        <FormButton
                          type="submit"
                          size="xl"
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
              </PriceCard>
            );
          })}
        </Container>
      </section>

      <section className={styles.root__legalSection}>
        <Container>
          <div className={styles.root__legalText}>
            <p>
              {t(
                'Monthly or annual subscription will be automatically renewed after the end of the paid period. You can cancel the automatic renewal at any time. When you cancel, the subscription will remain active until the end of the paid period. After that, the data will be available for reading only.'
              )}
            </p>
            <p>
              {t('By subscribing, you agree to the')}{' '}
              <Link href={`https://finex.io/${locale}legal/terms/`}>{t('Terms of Use')}</Link> {t('and the ')}{' '}
              <Link href={`https://finex.io/${locale}legal/privacy/`}>{t('Privacy Policy')}</Link>
            </p>
          </div>
        </Container>
      </section>

      <FAQSection
        heading={t('FAQs')}
        supportingText={
          <>
            {t('Everything you need to know about the billing. Can’t find the answer you’re looking for? Please ')}
            <a href="https://t.me/finex_support">{t('chat to our friendly team.')}</a>
          </>
        }
        faqItems={faqItems}
      />
    </main>
  );
});
