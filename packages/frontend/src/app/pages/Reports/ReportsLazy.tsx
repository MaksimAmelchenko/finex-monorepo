import React, { lazy } from 'react';

const Reports = lazy(() => import(/* webpackChunkName: "reports" */ './Reports'));

export const ReportsLazy = () => <Reports />;
