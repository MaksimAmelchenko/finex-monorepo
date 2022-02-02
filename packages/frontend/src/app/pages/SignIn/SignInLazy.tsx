import React, { lazy } from 'react';

const SignIn = lazy(() => import(/* webpackChunkName: "sign-in" */ './SignIn'));

export const SignInLazy = () => <SignIn />;
