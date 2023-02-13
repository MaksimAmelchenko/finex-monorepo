import React, { Fragment, Suspense, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { Loader } from '../../components/Loader/Loader';
import { ProfileRepository } from '../../stores/profile-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import { BottomNavigation } from './BottomNavigation/BottomNavigation';

import styles from './MainLayoutMobile.module.scss';

const t = getT('MainLayoutMobile');

export const MainLayoutMobile: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  const profileRepository = useStore(ProfileRepository);

  const { profile } = profileRepository;

  if (!profile) {
    return <Loader />;
  }

  return (
    <div className={styles.page}>
      <Suspense fallback={<Loader />}>{children}</Suspense>
      <BottomNavigation />
    </div>
  );
});
