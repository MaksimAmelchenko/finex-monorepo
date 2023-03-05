import React, { useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import { Account } from '../../stores/models/account';
import { AccountRow } from './Account/AccountRow';
import { AccountWindow } from '../AccountWindow/AccountWindow';
import { AccountsRepository } from '../../stores/accounts-repository';
import { Button, PlusIcon } from '@finex/ui-kit';
import { Drawer } from '../../components/Drawer/Drawer';
import { IAccount } from '../../types/account';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './Accounts.module.scss';

const t = getT('Accounts');

export const Accounts = observer(() => {
  const accountsRepository = useStore(AccountsRepository);

  const [isOpenedAccountWindow, setIsOpenedAccountWindow] = useState<boolean>(false);
  const [account, setAccount] = useState<Partial<IAccount> | Account | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleAddClick = () => {
    setAccount({});
    setIsOpenedAccountWindow(true);
  };

  const { accounts } = accountsRepository;

  const selectedAccounts = accounts.filter(({ isSelected }) => isSelected);

  const handleDeleteClick = () => {
    if (selectedAccounts.length > 1) {
      if (!window.confirm(t('Are you sure you want to delete several accounts?'))) {
        return;
      }
    }
    selectedAccounts.forEach(account => {
      accountsRepository.deleteAccount(account).catch(err => {
        let message = '';
        switch (err.code) {
          case 'cashflow_detail_2_account': {
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
      <article className={styles.article}>
        <div className={clsx(styles.article__panel, styles.panel)}>
          <div className={clsx(styles.panel__toolbar, styles.toolbar)}>
            <div className={styles.toolbar__buttons}>
              <Button size="sm" startIcon={<PlusIcon />} onClick={handleAddClick}>
                {t('New')}
              </Button>
              <Button variant="secondaryGray" size="sm" disabled={!selectedAccounts.length} onClick={handleDeleteClick}>
                {t('Delete')}
              </Button>
              <Button variant="secondaryGray" size="sm" onClick={handleRefreshClick}>
                {t('Refresh')}
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={clsx('table table-hover table-sm')}>
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
        </div>
      </article>

      <Drawer isOpened={isOpenedAccountWindow}>
        {account && <AccountWindow account={account} onClose={handleCloseAccountWindow} />}
      </Drawer>
    </>
  );
});

export default Accounts;
