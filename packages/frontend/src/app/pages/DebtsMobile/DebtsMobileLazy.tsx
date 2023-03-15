import React, { lazy } from 'react';

const DebtsMobile = lazy(() => import(/* webpackChunkName: "debts-mobile" */ './DebtsMobile'));

export const DebtsMobileLazy = () => <DebtsMobile />;
