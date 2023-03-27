import React, { Suspense, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AccountsLazy } from '../../containers/Accounts/AccountsLazy';
import { CategoriesLazy } from '../../containers/Categories/CategoriesLazy';
import { ContractorsLazy } from '../../containers/Contractors/ContractorsLazy';
import { HeaderLayout } from '../../components/HeaderLayout/HeaderLayout';
import { ITabOption, Tabs } from '../../components/Tabs/Tabs';
import { Loader } from '../../components/Loader/Loader';
import { MoneysLazy } from '../../containers/Moneys/MoneysLazy';
import { ProjectsLazy } from '../../containers/Projects/ProjectsLazy';
import { TagsLazy } from '../../containers/Tags/TagsLazy';
import { UnitsLazy } from '../../containers/Units/UnitsLazy';
import { getT } from '../../lib/core/i18n';

import styles from './Settings.module.scss';

const t = getT('Settings');

export const Settings = observer(() => {
  const options: ITabOption[] = useMemo(
    () => [
      //
      { value: 'accounts', label: t('Accounts') },
      { value: 'categories', label: t('Categories') },
      { value: 'contractors', label: t('Contractors') },
      { value: 'units', label: t('Units') },
      { value: 'tags', label: t('Tags') },
      { value: 'moneys', label: t('Money') },
      { value: 'projects', label: t('Projects') },
    ],
    []
  );
  const navigate = useNavigate();
  const { tab } = useParams<'tab'>();

  const handleChangeTab = (tab: string) => {
    navigate(`/settings/${tab}`);
  };

  if (!tab) {
    return <Navigate to="/settings/accounts" replace={true} />;
  }

  return (
    <div className={styles.layout}>
      <HeaderLayout title={t('Settings')} />
      <div className={styles.layout__tabs}>
        <Tabs options={options} value={tab} onChange={handleChangeTab} />
      </div>
      <main className={styles.content}>
        <Suspense fallback={<Loader />}>
          {tab === 'accounts' && <AccountsLazy />}
          {tab === 'categories' && <CategoriesLazy />}
          {tab === 'contractors' && <ContractorsLazy />}
          {tab === 'units' && <UnitsLazy />}
          {tab === 'tags' && <TagsLazy />}
          {tab === 'moneys' && <MoneysLazy />}
          {tab === 'projects' && <ProjectsLazy />}
        </Suspense>
      </main>
    </div>
  );
});

export default Settings;
