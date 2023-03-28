import React, { lazy } from 'react';

import { CategoriesMobileContentProps } from './CategoriesMobileContent';

const CategoriesMobileContent = lazy(
  () => import(/* webpackChunkName: "categories-mobile" */ './CategoriesMobileContent')
);

export const CategoriesMobileContentLazy = (props: CategoriesMobileContentProps) => (
  <CategoriesMobileContent {...props} />
);
