import React, { lazy } from 'react';

const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ './Dashboard'));

export const DashboardLazy = () => <Dashboard />;
