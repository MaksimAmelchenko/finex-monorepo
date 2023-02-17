import React, { lazy } from 'react';

const OutcomeMobile = lazy(() => import(/* webpackChunkName: "outcome-mobile" */ './OutcomeMobile'));

export const OutcomeMobileLazy = () => <OutcomeMobile />;
