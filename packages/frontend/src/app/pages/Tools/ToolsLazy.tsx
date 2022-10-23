import React, { lazy } from 'react';

const Tools = lazy(() => import(/* webpackChunkName: "tools" */ './Tools'));

export const ToolsLazy = () => <Tools />;
