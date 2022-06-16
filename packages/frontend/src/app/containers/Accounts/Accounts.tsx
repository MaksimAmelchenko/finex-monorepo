import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Account } from '../../stores/models/account';
import { AccountRow } from './Account/AccountRow';
import { AccountWindow } from '../AccountWindow/AccountWindow';
import { AccountsRepository } from '../../stores/accounts-repository';
import { Button } from '@finex/ui-kit';
import { IAccount } from '../../types/account';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Accounts.module.scss';

const t = getT('Accounts');

export const Accounts = observer(() => {
  const accountsRepository = useStore(AccountsRepository);
  const { accounts } = accountsRepository;

  const [isOpenedAccountWindow, setIsOpenedAccountWindow] = useState<boolean>(false);
  const [account, setAccount] = useState<Partial<IAccount> | Account | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleAddClick = () => {
    setAccount({});
    setIsOpenedAccountWindow(true);
  };

  const selectedAccounts = accounts.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedAccounts.length > 1) {
      if (!window.confirm(t('Are you sure you what to delete several accounts?'))) {
        return;
      }
    }
    selectedAccounts.forEach(account => {
      accountsRepository.deleteAccount(account).catch(err => {
        let message = '';
        switch (err.code) {
          case 'foreign_key_violation.cashflow_detail_2_account': {
            message = t('There are transactions on this account');
            break;
          }
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
    });
  };

  const handleRefreshClick = () => {
    accountsRepository.getAccounts();
  };

  const handleClickOnAccount = (account: Account) => {
    setAccount(account);
    setIsOpenedAccountWindow(true);
  };

  const handleCloseAccountWindow = () => {
    setIsOpenedAccountWindow(false);
  };

  return (
    <>
      <article>
        <div className={styles.panel}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button variant="contained" size="small" color="secondary" onClick={handleAddClick}>
                {t('New')}
              </Button>
              <Button variant="outlined" size="small" disabled={!selectedAccounts.length} onClick={handleDeleteClick}>
                {t('Delete')}
              </Button>
              <Button variant="outlined" size="small" onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
            </div>
          </div>
        </div>
        <table className={clsx('table table-hover table-sm', styles.table)}>
          <thead>
            <tr>
              <th rowSpan={2} />
              <th rowSpan={2}>{t('Name')}</th>
              <th rowSpan={2}>{t('Active')}</th>
              <th rowSpan={2}>{t('Owner')}</th>
              <th colSpan={2}>{t('Permit')}</th>
              <th rowSpan={2}>{t('Type')}</th>
              <th rowSpan={2}>{t('Note')}</th>
            </tr>
            <tr>
              <th>{t('Read')}</th>
              <th>{t('Edit')}</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <AccountRow account={account} onClick={handleClickOnAccount} key={account.id} />
            ))}
          </tbody>
        </table>
      </article>

      {account && (
        <AccountWindow isOpened={isOpenedAccountWindow} account={account} onClose={handleCloseAccountWindow} />
      )}
    </>
  );
});

export default Accounts;
