import React, { lazy } from 'react';

const MainLayoutMobile = lazy(() => import(/* webpackChunkName: "main-layout-mobile" */ './MainLayoutMobile'));

export const MainLayoutMobileLazy = (props: any) => <MainLayoutMobile {...props} />;
