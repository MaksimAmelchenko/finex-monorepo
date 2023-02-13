import React, { lazy } from 'react';

const Operations = lazy(() => import(/* webpackChunkName: "operations" */ './Operations'));

export const OperationsLazy = () => <Operations />;
