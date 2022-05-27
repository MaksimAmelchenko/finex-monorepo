import React, { lazy } from 'react';

const Categories = lazy(() => import(/* webpackChunkName: "categories" */ './Categories'));

export const CategoriesLazy = () => <Categories />;
