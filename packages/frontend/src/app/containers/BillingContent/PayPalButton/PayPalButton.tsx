import React, { useRef } from 'react';
import { CreateSubscriptionActions, OnApproveActions, OnApproveData } from '@paypal/paypal-js/types/components/buttons';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { observer } from 'mobx-react-lite';
import { parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { BillingRepository } from '../../../stores/billing-repository';
import { Plan } from '../../../types/billing';
import { ProfileRepository } from '../../../stores/profile-repository';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

interface PayPalButtonProps {
  plan: Plan;
  onAfter: () => Promise<void>;
}

const NX_PAYPAL_CLIENT_ID = process.env.NX_PAYPAL_CLIENT_ID!;

const t = getT('PayPalButton');

export const PayPalButton = observer<PayPalButtonProps>(({ plan, onAfter }) => {
  const profileRepository = useStore(ProfileRepository);
  const billingRepository = useStore(BillingRepository);

  const subscriptionRef = useRef<string | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const { paypalPlanId } = plan;

  const handleCreateSubscription = async (data: Record<string, unknown>, actions: CreateSubscriptionActions) => {
    const { subscriptionId } = await billingRepository.createSubscription('paypal', plan.id);

    subscriptionRef.current = subscriptionId;
    let startTime: string | undefined;
    if (profileRepository.profile?.accessUntil) {
      const accessUntil = parseISO(profileRepository.profile.accessUntil);
      if (accessUntil > new Date()) {
        startTime = accessUntil.toISOString();
      }
    }

    return actions.subscription
      .create({
        plan_id: paypalPlanId!,
        start_time: startTime,
        custom_id: subscriptionId,
      })
      .then(async gatewaySubscriptionId => {
        await billingRepository.updateSubscription(subscriptionId, {
          gatewaySubscriptionId,
        });
        return gatewaySubscriptionId;
      });
  };

  const handleApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    // console.log('onApprove', { data });
    const subscriptionId = subscriptionRef.current!;
    return billingRepository.subscriptionStatusPolling(subscriptionId).then(() => {
      onAfter();
    });
  };

  const handleError = (error: Record<string, unknown>) => {
    console.error({ error });
    billingRepository.stopPolling();
    enqueueSnackbar(t('Something went wrong, please try again late'), { variant: 'error' });
  };

  if (!paypalPlanId) {
    return null;
  }

  if (!profileRepository.profile) {
    return null;
  }

  return (
    <PayPalScriptProvider
      options={{
        'client-id': NX_PAYPAL_CLIENT_ID,
        components: 'buttons',
        intent: 'subscription',
        vault: true,
      }}
    >
      <PayPalButtons
        createSubscription={handleCreateSubscription}
        onApprove={handleApprove}
        onError={handleError}
        style={{
          label: 'subscribe',
          color: 'blue',
        }}
      />
    </PayPalScriptProvider>
  );
});
