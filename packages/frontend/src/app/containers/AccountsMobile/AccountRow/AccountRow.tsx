import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Account } from '../../../stores/models/account';

import styles from './AccountRow.module.scss';

interface AccountRowProps {
  account: Account;
  onClick: (account: Account, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const AccountRow = observer<AccountRowProps>(({ account, onClick }) => {
  const { name, isEnabled } = account;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick(account, event);
  };

  return (
    <button type="button" className={clsx(styles.root, !isEnabled && styles.root_disabled)} onClick={handleClick}>
      <div className={styles.root__content}>
        <div className={styles.root__name}>{name}</div>
      </div>
    </button>
  );
});
