import React from 'react';
import { observer } from 'mobx-react-lite';

import { ChangePassword } from './ChangePassword/ChangePassword';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { MainSettings } from './MainSettings/MainSettings';
import { ProfileRepository } from '../../stores/profile-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Profile.module.scss';
import { DeleteAccount } from './DeleteAccount/DeleteAccount';
import { Container } from '../../components/Container/Container';

const t = getT('Profile');

export const Profile = observer(() => {
  const profileRepository = useStore(ProfileRepository);

  const { profile } = profileRepository;

  if (!profile) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Profile')} className={styles.header} />
      <main className={styles.content}>
        <Container className={styles.container}>
          <MainSettings profile={profile} />
          <hr className={styles.delimiter} />
          <ChangePassword username={profile.email} />
          <hr className={styles.delimiter} />
          <DeleteAccount username={profile.email} />
        </Container>
      </main>
    </div>
  );
});

export default Profile;
