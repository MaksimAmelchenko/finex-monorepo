import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Account } from '../../stores/models/account';
import { AccountRow } from './AccountRow/AccountRow';
import { AccountsRepository } from '../../stores/accounts-repository';
import { BackButton, Header } from '../../components/Header/Header';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';
import { analytics } from '../../lib/analytics';

const t = getT('AccountsMobile');

export interface AccountsMobileContentProps {
  onSelect?: (account: Account) => void;
  onClose: () => void;
}

export const AccountsMobileContent = observer<AccountsMobileContentProps>(({ onSelect, onClose }) => {
  const accountsRepository = useStore(AccountsRepository);
  const { accounts } = accountsRepository;
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'accounts-mobile',
    });
  }, []);

  const handleClick = useCallback(
    (account: Account, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(account);
      }
    },
    [isSelectMode, onSelect]
  );

  return (
    <>
      <Header title={t('Accounts')} startAdornment={<BackButton onClick={onClose} />} />
      <SideSheetBody>
        {accounts
          .filter(({ isEnabled }) => !isSelectMode || (isSelectMode && isEnabled))
          .map(account => {
            return <AccountRow account={account} onClick={handleClick} key={account.id} />;
          })}
      </SideSheetBody>
    </>
  );
});

export default AccountsMobileContent;
