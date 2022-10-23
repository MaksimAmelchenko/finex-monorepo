import React, { lazy } from 'react';

const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './Profile'));

export const ProfileLazy = () => <Profile />;
