import React, { lazy } from 'react';

const Tags = lazy(() => import(/* webpackChunkName: "tags" */ './Tags'));

export const TagsLazy = () => <Tags />;
