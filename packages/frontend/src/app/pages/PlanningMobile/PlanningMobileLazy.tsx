import React, { lazy } from 'react';

const PlanningMobile = lazy(() => import(/* webpackChunkName: "planning-mobile" */ './PlanningMobile'));

export const PlanningMobileLazy = () => <PlanningMobile />;
