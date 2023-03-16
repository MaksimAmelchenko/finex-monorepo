import React, { lazy } from 'react';

import { ContractorsMobileContentProps } from './ContractorsMobileContent';

const ContractorsMobileContent = lazy(
  () => import(/* webpackChunkName: "contractors-mobile" */ './ContractorsMobileContent')
);

export const ContractorsMobileContentLazy = (props: ContractorsMobileContentProps) => (
  <ContractorsMobileContent {...props} />
);
