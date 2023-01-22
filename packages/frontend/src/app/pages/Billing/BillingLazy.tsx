import React, { lazy } from 'react';

const Billing = lazy(() => import(/* webpackChunkName: "billing" */ './Billing'));

export const BillingLazy = () => <Billing />;
