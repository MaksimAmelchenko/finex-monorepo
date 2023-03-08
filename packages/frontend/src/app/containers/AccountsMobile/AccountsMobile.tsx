import React from 'react';
import { observer } from 'mobx-react-lite';

import { Account } from '../../stores/models/account';
import { AccountRow } from './AccountRow/AccountRow';
import { AccountsRepository } from '../../stores/accounts-repository';
import { Drawer } from '../../components/Drawer/Drawer';
import { BackButton, Header } from '../../components/Header/Header';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './AccountsMobile.module.scss';

const t = getT('AccountsMobile');

interface AccountsMobileProps {
  open: boolean;
  onSelect: (account: Account) => void;
  onClose: () => void;
}

export const AccountsMobile = observer<AccountsMobileProps>(({ open, onSelect, onClose }) => {
  const accountsRepository = useStore(AccountsRepository);
  const { accounts } = accountsRepository;
  const isSelectMode = Boolean(onSelect);

  const handleOnClick = (account: Account, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isSelectMode) {
      onSelect(account);
    }
  };

  return (
    <Drawer open={open} className={styles.root}>
      <Header title={t('Accounts')} startAdornment={<BackButton onClick={onClose} />} />
      <main className={styles.root__main}>
        {accounts
          .filter(({ isEnabled }) => !isSelectMode || (isSelectMode && isEnabled))
          .map(account => {
            return <AccountRow account={account} onClick={handleOnClick} key={account.id} />;
          })}
      </main>
    </Drawer>
  );
});
