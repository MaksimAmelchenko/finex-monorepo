import React, { lazy } from 'react';

const Settings = lazy(() => import(/* webpackChunkName: "settings" */ './Settings'));

export const SettingsLazy = () => <Settings />;
