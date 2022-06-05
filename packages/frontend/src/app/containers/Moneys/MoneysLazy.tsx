import React, { lazy } from 'react';

const Moneys = lazy(() => import(/* webpackChunkName: "moneys" */ './Moneys'));

export const MoneysLazy = () => <Moneys />;
