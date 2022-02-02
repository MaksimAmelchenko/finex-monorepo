import React, { lazy } from 'react';

const SignUp = lazy(() => import(/* webpackChunkName: "sign-up" */ './SignUp'));

export const SignUpLazy = () => <SignUp />;
