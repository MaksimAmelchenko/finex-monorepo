import React, { lazy } from 'react';

import { UnitsMobileContentProps } from './UnitsMobileContent';

const UnitsMobileContent = lazy(() => import(/* webpackChunkName: "units-mobile" */ './UnitsMobileContent'));

export const UnitsMobileContentLazy = (props: UnitsMobileContentProps) => <UnitsMobileContent {...props} />;
