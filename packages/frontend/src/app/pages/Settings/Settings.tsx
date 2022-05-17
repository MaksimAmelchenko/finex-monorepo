import React, { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AccountsLazy } from '../../containers/Accounts/AccountsLazy';
import { ITabOption, Tabs } from '../../components/Tabs/Tabs';
import { getT } from '../../lib/core/i18n';

const t = getT('Settings');

export const Settings = observer(() => {
  const options: ITabOption[] = useMemo(
    () => [
      //
      { value: 'accounts', label: t('Accounts') },
      { value: 'categories', label: t('Categories') },
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
    </article>
  );
});

export default Settings;
