import React, { lazy } from 'react';

const Accounts = lazy(() => import(/* webpackChunkName: "accounts" */ './Accounts'));

export const AccountsLazy = () => <Accounts />;
