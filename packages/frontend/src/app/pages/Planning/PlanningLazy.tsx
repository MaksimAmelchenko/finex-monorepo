import React, { lazy } from 'react';

const Planning = lazy(() => import(/* webpackChunkName: "plans" */ './Planning'));

export const PlanningLazy = () => <Planning />;
