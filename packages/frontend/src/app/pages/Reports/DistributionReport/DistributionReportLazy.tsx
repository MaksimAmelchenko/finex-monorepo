import React, { lazy } from 'react';

const DistributionReport = lazy(() => import(/* webpackChunkName: "distribution-report" */ './DistributionReport'));

export const DistributionReportLazy = () => <DistributionReport />;
