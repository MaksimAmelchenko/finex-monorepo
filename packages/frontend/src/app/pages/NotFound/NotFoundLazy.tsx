import React, { lazy } from 'react';

const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ './NotFound'));

export const NotFoundLazy = () => <NotFound />;
