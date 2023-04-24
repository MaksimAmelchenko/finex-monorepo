import React, { lazy } from 'react';

const SignUpConfirmation = lazy(() => import(/* webpackChunkName: "sign-up-confirmation" */ './SignUpConfirmation'));

export const SignUpConfirmationLazy = () => <SignUpConfirmation />;
