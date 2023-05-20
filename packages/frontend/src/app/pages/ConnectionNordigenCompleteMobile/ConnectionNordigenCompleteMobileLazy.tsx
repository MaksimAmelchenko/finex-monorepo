import React, { lazy } from 'react';

const ConnectionNordigenCompleteMobile = lazy(
  () => import(/* webpackChunkName: "connection-nordigen-complete-mobile" */ './ConnectionNordigenCompleteMobile')
);

export const ConnectionNordigenCompleteMobileLazy = () => <ConnectionNordigenCompleteMobile />;
