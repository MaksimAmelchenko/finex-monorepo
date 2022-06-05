import React, { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AccountsLazy } from '../../containers/Accounts/AccountsLazy';
import { CategoriesLazy } from '../../containers/Categories/CategoriesLazy';
import { ContractorsLazy } from '../../containers/Contractors/ContractorsLazy';
import { ITabOption, Tabs } from '../../components/Tabs/Tabs';
import { MoneysLazy } from '../../containers/Moneys/MoneysLazy';
import { TagsLazy } from '../../containers/Tags/TagsLazy';
import { UnitsLazy } from '../../containers/Units/UnitsLazy';
import { getT } from '../../lib/core/i18n';

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
    <article>
      <h1>Settings</h1>
      <Tabs options={options} value={tab} onChange={handleChangeTab} />

      {tab === 'accounts' && <AccountsLazy />}
      {tab === 'categories' && <CategoriesLazy />}
      {tab === 'contractors' && <ContractorsLazy />}
      {tab === 'units' && <UnitsLazy />}
      {tab === 'tags' && <TagsLazy />}
      {tab === 'moneys' && <MoneysLazy />}
    </article>
  );
});

export default Settings;
