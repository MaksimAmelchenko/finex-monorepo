import React, { useCallback, useState } from 'react';
import clsx from 'clsx';

import { AppBarButton } from './AppBarButton/AppBarButton';
import { MessageQuestionSquareIcon, Settings02Icon } from '@finex/ui-kit';
import { SettingsMobileLazy } from '../../pages/SettingsMobile/SettingsMobileLazy';
import { SideSheetMobile } from '../SideSheetMobile/SideSheetMobile';

import styles from './AppBar.module.scss';

export interface AppBarProps {
  title: string;
  endAdornment?: React.ReactNode;
}

export function AppBar({ title, endAdornment: EndAdornment }: AppBarProps): JSX.Element {
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const handleSettingsClick = useCallback(() => {
    setOpenSettings(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setOpenSettings(false);
  }, []);

  return (
    <>
      <header className={styles.root}>
        <div className={clsx(styles.root__title, !Boolean(EndAdornment) && styles.root__title_withoutEndAdornment)}>
          {title}
        </div>
        {EndAdornment}
        {Boolean(EndAdornment) && <div className={styles.root__separator} />}
        {/*
        <AppBarButton icon={<MessageQuestionSquareIcon />} href="/help" />
        */}
        <AppBarButton icon={<Settings02Icon />} onClick={handleSettingsClick} />
      </header>

      <SideSheetMobile open={openSettings}>
        <SettingsMobileLazy onClose={handleSettingsClose} />
      </SideSheetMobile>
    </>
  );
}
