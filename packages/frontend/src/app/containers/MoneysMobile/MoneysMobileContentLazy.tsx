import React, { lazy } from 'react';

import { MoneysMobileContentProps } from './MoneysMobileContent';

const MoneysMobileContent = lazy(() => import(/* webpackChunkName: "moneys-mobile" */ './MoneysMobileContent'));

export const MoneysMobileContentLazy = (props: MoneysMobileContentProps) => <MoneysMobileContent {...props} />;
