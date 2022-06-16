import React from 'react';
import { observer } from 'mobx-react-lite';

import { useProfile } from '../../stores/profile-repository';

import './Profile.module.scss';
// import style from './Profile.module.scss';

export const Profile = observer(() => {
  const profile = useProfile();
  if (!profile) {
    return null;
  }
  const { user, project } = profile;
  return (
    <div className="profile">
      <h1>Profile</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
      {/*<p>{currencyRateSource.name}</p>*/}
      <p>{project?.name}</p>
    </div>
  );
});

export default Profile;
