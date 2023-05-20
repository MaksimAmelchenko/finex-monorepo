import React, { useCallback } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { AppBarButton } from './AppBarButton/AppBarButton';
import { AppStore } from '../../stores/app-store';
import { MessageQuestionSquareIcon, Settings02Icon } from '@finex/ui-kit';
import { SettingsMobileLazy } from '../../pages/SettingsMobile/SettingsMobileLazy';
import { SideSheet } from '../../pages/SettingsMobile/types';
import { SideSheetMobile } from '../SideSheetMobile/SideSheetMobile';
import { useStore } from '../../core/hooks/use-store';

import styles from './AppBar.module.scss';

export interface AppBarProps {
  title: string;
  endAdornment?: React.ReactNode;
}

export const AppBar = observer<AppBarProps>(({ title, endAdornment: EndAdornment }) => {
  const appStore = useStore(AppStore);

  const handleSettingsClick = useCallback(() => {
    appStore.openSettings(SideSheet.None);
  }, [appStore]);

  const handleSettingsClose = useCallback(() => {
    appStore.closeSettings();
  }, [appStore]);

  return (
    <>
      <header className={styles.root}>
        <div className={clsx(styles.root__title, !EndAdornment && styles.root__title_withoutEndAdornment)}>{title}</div>
        {EndAdornment}
        {Boolean(EndAdornment) && <div className={styles.root__separator} />}
        {/*
        <AppBarButton icon={<MessageQuestionSquareIcon />} href="/help" />
        */}
        <AppBarButton icon={<Settings02Icon />} onClick={handleSettingsClick} />
      </header>

      <SideSheetMobile open={appStore.isOpenedSettings}>
        <SettingsMobileLazy onClose={handleSettingsClose} />
      </SideSheetMobile>
    </>
  );
});
