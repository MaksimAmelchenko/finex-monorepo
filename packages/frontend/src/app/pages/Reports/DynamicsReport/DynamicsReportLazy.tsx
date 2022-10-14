import React, { lazy } from 'react';

const DynamicsReport = lazy(() => import(/* webpackChunkName: "dynamics-report" */ './DynamicsReport'));

export const DynamicsReportLazy = () => <DynamicsReport />;
