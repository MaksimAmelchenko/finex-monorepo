import React, { lazy } from 'react';

const SignUp = lazy(() => import(/* webpackChunkName: "sign-up-confirmation" */ './SignUpConfirmation'));

export const SignUpConfirmationLazy = () => <SignUp />;
