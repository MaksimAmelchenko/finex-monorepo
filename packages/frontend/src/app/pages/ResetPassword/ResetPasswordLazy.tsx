import React, { lazy } from 'react';

const ResetPassword = lazy(() => import(/* webpackChunkName: "reset-password" */ './ResetPassword'));

export const ResetPasswordLazy = () => <ResetPassword />;
