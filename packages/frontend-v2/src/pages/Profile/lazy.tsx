import { h } from 'preact';
import { lazy } from 'preact/compat';

const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './index'));

export const ProfileLazy = () => <Profile />;
