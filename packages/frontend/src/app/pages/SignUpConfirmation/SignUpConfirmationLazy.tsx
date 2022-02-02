import React, { lazy } from 'react';

const SignUp = lazy(() => import(/* webpackChunkName: "sign-up" */ './SignUpConfirmation'));

export const SignUpConfirmationLazy = () => <SignUp />;
