import React, { lazy } from 'react';

const Units = lazy(() => import(/* webpackChunkName: "units" */ './Units'));

export const UnitsLazy = () => <Units />;
