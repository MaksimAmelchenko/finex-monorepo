import React, { lazy } from 'react';

const SignIn = lazy(() => import(/* webpackChunkName: "sign-in" */ './Auth'));

export const SignInLazy = () => <SignIn />;
