import React, { lazy } from 'react';

import { SettingsMobileProps } from './SettingsMobile';

const SettingsMobile = lazy(() => import(/* webpackChunkName: "settings-mobile" */ './SettingsMobile'));

export const SettingsMobileLazy = (props: SettingsMobileProps) => {
  return <SettingsMobile {...props} />;
};
