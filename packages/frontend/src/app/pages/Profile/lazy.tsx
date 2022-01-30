import React, {lazy} from 'react';


const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './index'));

export const ProfileLazy = () => <Profile />;
