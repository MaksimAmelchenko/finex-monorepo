import React from 'react';
import { Helmet } from 'react-helmet';
import { useSnackbar } from 'notistack';

import { BillingRepository } from '../../../stores/billing-repository';
import { CreateYookassaSubscriptionResponse, Plan } from '../../../types/billing';
import { Form, FormButton } from '../../../components/Form';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

const t = getT('YooKassaButton');

interface PayPalButtonProps {
  plan: Plan;
  onAfter: () => Promise<void>;
}

export function YooKassaButton({ plan, onAfter }: PayPalButtonProps): JSX.Element {
  const billingRepository = useStore(BillingRepository);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (): Promise<unknown> => {
    const { subscriptionId, paymentConfirmationToken } = await billingRepository
      .createSubscription<CreateYookassaSubscriptionResponse>('yookassa', plan.id)
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
        throw new Error(error);
      });

    const checkout = new window.YooMoneyCheckoutWidget({
      confirmation_token: paymentConfirmationToken,
      customization: {
        modal: true,
      },

      error_callback: function (error: any) {
        enqueueSnackbar(error.message, { variant: 'error' });
        console.error({ error });
      },
    });

    checkout.on('success', async () => {
      checkout.destroy();
      await billingRepository
        .subscriptionStatusPolling(subscriptionId)
        .then(() => {
          onAfter();
        })
        .catch(error => {
          enqueueSnackbar(error.message, { variant: 'error' });
        });
    });

    checkout.on('fail', (error: any) => {
      checkout.destroy();
      enqueueSnackbar(error.message, { variant: 'error' });
      console.error({ error });
    });

    return checkout.render();
  };

  return (
    <>
      <Helmet>
        <script src="https://static.yoomoney.ru/checkout-client/checkout-widget.js" />
      </Helmet>

      <Form onSubmit={handleSubmit} initialValues={{}} name="subscription">
        <FormButton type="submit">{t('Subscribe')}</FormButton>
      </Form>
    </>
  );
}
