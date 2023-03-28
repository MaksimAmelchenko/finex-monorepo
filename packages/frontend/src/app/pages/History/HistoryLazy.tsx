import React, { lazy } from 'react';

const History = lazy(() => import(/* webpackChunkName: "history" */ './History'));

export const HistoryLazy = () => <History />;
