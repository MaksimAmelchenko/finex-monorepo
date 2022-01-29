import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import { useProfile } from '../../stores/profile-repository';

import style from './style.css';

export const Profile = observer(() => {
  const profile = useProfile();
  if (!profile) {
    return null;
  }
  const { user, currencyRateSource, project } = profile;
  return (
    <div class={style.profile}>
      <h1>Profile</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{currencyRateSource.name}</p>
      <p>{project.name}</p>
    </div>
  );
});

export default Profile;
