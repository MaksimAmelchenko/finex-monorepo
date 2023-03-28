import React, { lazy } from 'react';

import { ProfileMobileContentProps } from './ProfileMobileContent';

const ProfileContent = lazy(() => import(/* webpackChunkName: "profile-mobile" */ './ProfileMobileContent'));

export const ProfileMobileContentLazy = (props: ProfileMobileContentProps) => <ProfileContent {...props} />;
