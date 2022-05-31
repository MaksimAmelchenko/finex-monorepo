import React, { lazy } from 'react';

const Contractors = lazy(() => import(/* webpackChunkName: "contractors" */ './Contractors'));

export const ContractorsLazy = () => <Contractors />;
