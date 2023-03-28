import React, { lazy } from 'react';

const MainLayout = lazy(() => import(/* webpackChunkName: "main-layout" */ './MainLayout'));

export const MainLayoutLazy = (props: any) => <MainLayout {...props} />;
