import React, { lazy } from 'react';

import { AccountsMobileContentProps } from './AccountsMobileContent';

const AccountsMobileContent = lazy(() => import(/* webpackChunkName: "accounts-mobile" */ './AccountsMobileContent'));

export const AccountsMobileContentLazy = (props: AccountsMobileContentProps) => <AccountsMobileContent {...props} />;
