import React, { lazy } from 'react';

const ResetPasswordConfirmation = lazy(
  () => import(/* webpackChunkName: "reset-password-confirmation" */ './ResetPasswordConfirmation')
);

export const ResetPasswordConfirmationLazy = () => <ResetPasswordConfirmation />;
