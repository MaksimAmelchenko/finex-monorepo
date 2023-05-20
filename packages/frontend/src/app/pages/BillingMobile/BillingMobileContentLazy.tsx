import React, { lazy } from 'react';

import { BillingMobileContentProps } from './BillingMobileContent';

const BillingContent = lazy(() => import(/* webpackChunkName: "billing-mobile" */ './BillingMobileContent'));

export const BillingMobileContentLazy = (props: BillingMobileContentProps) => <BillingContent {...props} />;
