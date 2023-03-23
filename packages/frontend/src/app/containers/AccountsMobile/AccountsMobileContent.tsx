import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { Account } from '../../stores/models/account';
import { AccountRow } from './AccountRow/AccountRow';
import { AccountWindowMobile } from '../AccountWindowMobile/AccountWindowMobile';
import { AccountsRepository } from '../../stores/accounts-repository';
import { AddButton, BackButton, Header } from '../../components/Header/Header';
import { Button, PlusIcon, Wallet01Icon } from '@finex/ui-kit';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IAccount } from '../../types/account';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './AccountsMobileContent.module.scss';

const t = getT('AccountsMobile');

export interface AccountsMobileContentProps {
  onSelect?: (account: Account) => void;
  onClose: () => void;
}

export const AccountsMobileContent = observer<AccountsMobileContentProps>(({ onSelect, onClose }) => {
  const accountsRepository = useStore(AccountsRepository);
  const [account, setAccount] = useState<Partial<IAccount> | Account | null>(null);

  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'accounts-mobile',
    });
  }, []);

  const handleAddClick = useCallback(() => {
    setAccount({});
  }, []);

  const handleClick = useCallback(
    (account: Account, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(account);
      } else {
        setAccount(account);
      }
    },
    [isSelectMode, onSelect]
  );

  const accounts = accountsRepository.accounts.filter(({ isEnabled }) => !isSelectMode || (isSelectMode && isEnabled));

  function renderContent(): JSX.Element {
    if (!accounts.length) {
      return (
        <div className={styles.root__emptyState}>
          <EmptyState
            illustration={<Wallet01Icon className={styles.root__emptyStateIllustration} />}
            text={t('You do not have accounts yet')}
            supportingText={t('Start creating by clicking on\u00A0"Create\u00A0account"')}
          >
            <Button size="sm" startIcon={<PlusIcon />} onClick={handleAddClick}>
              {t('Create account')}
            </Button>
          </EmptyState>
        </div>
      );
    }

    return (
      <>
        {accounts.map(account => (
          <AccountRow account={account} onClick={handleClick} key={account.id} />
        ))}
      </>
    );
  }

  return (
    <>
      <Header
        title={t('Accounts')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={<AddButton onClick={handleAddClick} />}
      />
      <SideSheetBody>{renderContent()}</SideSheetBody>

      <SideSheetMobile open={Boolean(account)}>
        {account && <AccountWindowMobile account={account} onClose={() => setAccount(null)} />}
      </SideSheetMobile>
    </>
  );
});

export default AccountsMobileContent;
