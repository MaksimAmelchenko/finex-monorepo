import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { AccountsMobile } from '../../containers/AccountsMobile/AccountsMobile';
import { AppStore } from '../../stores/app-store';
import { AuthRepository } from '../../core/other-stores/auth-repository';
import { BackButton, Header } from '../../components/Header/Header';
import {
  BankIcon,
  Building02Icon,
  Coins02Icon,
  CreditCard01Icon,
  FolderIcon,
  IOption,
  LogOut01Icon,
  MiscellaneousIcon,
  SelectNative,
  SpacingWidth01Icon,
  Tag01Icon,
  User01Icon,
  Wallet01Icon,
} from '@finex/ui-kit';
import { BillingMobile } from '../BillingMobile/BillingMobile';
import { CategoriesMobile } from '../../containers/CategoriesMobile/CategoriesMobile';
import { ConnectionsMobile } from '../ConnectionsMobile/ConnectionsMobile';
import { ContractorsMobile } from '../../containers/ContractorsMobile/ContractorsMobile';
import { MenuItem } from './MenuItem/MenuItem';
import { MoneysMobile } from '../../containers/MoneysMobile/MoneysMobile';
import { ProfileMobile } from '../ProfileMobile/ProfileMobile';
import { ProjectsMobile } from '../../containers/ProjectsMobile/ProjectsMobile';
import { ProjectsRepository } from '../../stores/projects-repository';
import { SettingsMobileProps, SideSheet } from './types';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { TagsMobile } from '../../containers/TagsMobile/TagsMobile';
import { UnitsMobile } from '../../containers/UnitsMobile/UnitsMobile';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './SettingsMobile.module.scss';

const t = getT('Settings');

interface IMenuItem {
  menuItemId: string;
  icon: React.ReactNode;
  text: string;
}

export const SettingsMobile = observer<SettingsMobileProps>(({ onClose }) => {
  const authRepository = useStore(AuthRepository);
  const appStore = useStore(AppStore);
  const projectsRepository = useStore(ProjectsRepository);
  const [sideSheet, setSideSheet] = useState<SideSheet>(appStore.settingSideSheet);
  const { enqueueSnackbar } = useSnackbar();

  const { currentProject, projects } = projectsRepository;

  useEffect(() => {
    analytics.view({
      page_title: 'settings-mobile',
    });
  }, []);

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = event.target.value;
    projectsRepository.useProject(projectId).catch(err => {
      let message = '';
      switch (err.code) {
        default:
          message = err.message;
      }
      enqueueSnackbar(message, { variant: 'error' });
    });
  };

  const selectProjectOptions = useMemo<IOption[]>(() => {
    return projects.map(({ id: value, name: label }) => ({ value, label }));
  }, [projects]);

  const references: IMenuItem[] = useMemo(
    () => [
      { menuItemId: SideSheet.Accounts, icon: <Wallet01Icon />, text: t('Accounts') },
      { menuItemId: SideSheet.Categories, icon: <MiscellaneousIcon />, text: t('Categories') },
      { menuItemId: SideSheet.Contractors, icon: <Building02Icon />, text: t('Contractors') },
      { menuItemId: SideSheet.Units, icon: <SpacingWidth01Icon />, text: t('Units') },
      { menuItemId: SideSheet.Tags, icon: <Tag01Icon />, text: t('Tags') },
      { menuItemId: SideSheet.Moneys, icon: <Coins02Icon />, text: t('Money') },
      { menuItemId: SideSheet.Projects, icon: <FolderIcon />, text: t('Projects') },
    ],
    []
  );

  const handleMenuItemClick = useCallback((menuItemId: string) => {
    const sideSheet = menuItemId as SideSheet;
    setSideSheet(sideSheet);
  }, []);

  const handleCloseSideSheet = useCallback(() => {
    setSideSheet(SideSheet.None);
  }, []);

  if (!currentProject) {
    return null;
  }

  return (
    <>
      <Header title={t('Settings')} startAdornment={<BackButton onClick={onClose} />} />
      <SideSheetBody className={styles.root}>
        {currentProject && (
          <section className={styles.section}>
            <SelectNative
              label={t('Current project')}
              options={selectProjectOptions}
              value={currentProject.id}
              onChange={handleProjectChange}
            />
          </section>
        )}

        <section className={styles.menuSection}>
          <h2 className={styles.menuSection__header}>{t('References')}</h2>
          <div className={styles.menuSection__content}>
            {references.map(({ menuItemId, icon, text }) => {
              return (
                <MenuItem
                  menuItemId={menuItemId}
                  icon={icon}
                  text={text}
                  onClick={handleMenuItemClick}
                  key={menuItemId}
                />
              );
            })}
          </div>
        </section>

        <section className={styles.menuSection}>
          <h2 className={styles.menuSection__header}>{t('Integrations and connected apps')}</h2>
          <div className={styles.menuSection__content}>
            <MenuItem
              menuItemId={SideSheet.Connections}
              icon={<BankIcon />}
              text={t('Bank connections')}
              onClick={handleMenuItemClick}
            />
          </div>
        </section>

        <section className={styles.menuSection}>
          <h2 className={styles.menuSection__header}>{t('Profile')}</h2>
          <div className={styles.menuSection__content}>
            <MenuItem
              menuItemId={SideSheet.Profile}
              icon={<User01Icon />}
              text={t('Profile settings')}
              onClick={handleMenuItemClick}
            />
            <MenuItem
              menuItemId={SideSheet.Billing}
              icon={<CreditCard01Icon />}
              text={t('Billing & plans')}
              onClick={handleMenuItemClick}
            />
            <MenuItem
              menuItemId="signOut"
              icon={<LogOut01Icon />}
              text={t('Log out')}
              expandButton={false}
              onClick={() => authRepository.signOut()}
            />
          </div>
        </section>
      </SideSheetBody>

      <AccountsMobile open={sideSheet === SideSheet.Accounts} onClose={handleCloseSideSheet} />

      <CategoriesMobile open={sideSheet === SideSheet.Categories} onClose={handleCloseSideSheet} />

      <ContractorsMobile open={sideSheet === SideSheet.Contractors} onClose={handleCloseSideSheet} />

      <UnitsMobile open={sideSheet === SideSheet.Units} onClose={handleCloseSideSheet} />

      <TagsMobile open={sideSheet === SideSheet.Tags} onClose={handleCloseSideSheet} />

      <MoneysMobile open={sideSheet === SideSheet.Moneys} onClose={handleCloseSideSheet} />

      <ProjectsMobile open={sideSheet === SideSheet.Projects} onClose={handleCloseSideSheet} />

      <ProfileMobile open={sideSheet === SideSheet.Profile} onClose={handleCloseSideSheet} />

      <ConnectionsMobile open={sideSheet === SideSheet.Connections} onClose={handleCloseSideSheet} />

      <BillingMobile open={sideSheet === SideSheet.Billing} onClose={handleCloseSideSheet} />
    </>
  );
});

export default SettingsMobile;
