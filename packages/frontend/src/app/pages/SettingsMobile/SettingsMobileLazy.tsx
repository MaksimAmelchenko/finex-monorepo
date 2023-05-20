import React, { lazy } from 'react';

import { SettingsMobileProps } from './types';

const SettingsMobile = lazy(() => import(/* webpackChunkName: "settings-mobile" */ './SettingsMobile'));

export const SettingsMobileLazy = (props: SettingsMobileProps) => {
  return <SettingsMobile {...props} />;
};
