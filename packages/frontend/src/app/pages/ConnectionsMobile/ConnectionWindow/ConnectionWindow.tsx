import React from 'react';
import { observer } from 'mobx-react-lite';

import { BackButton, DeleteButton, Header } from '../../../components/Header/Header';
import { ConnectionAccountCard } from '../ConnectionAccountCard/ConnectionAccountCard';
import { ConnectionAccountWindow } from '../ConnectionAccountWindow/ConnectionAccountWindow';
import { ConnectionsRepository } from '../../../stores/connections-repository';
import { IAccount, IConnection } from '../../../types/connections';
import { SideSheetBody } from '../../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { SideSheetMobile } from '../../../components/SideSheetMobile/SideSheetMobile';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

interface ConnectionsWindowProps {
  connection: IConnection;
  onClose: () => void;
}

const t = getT('ConnectionWindow');

export const ConnectionWindow = observer(({ connection, onClose }: ConnectionsWindowProps) => {
  const connectionsRepository = useStore(ConnectionsRepository);

  const [account, setAccount] = React.useState<IAccount | null>(null);

  const handleClick = (account: IAccount) => {
    setAccount(account);
  };

  const handleDeleteClick = () => {
    if (!window.confirm(t('Are you sure you want to delete connection?'))) {
      return;
    }
    connectionsRepository.deleteConnection(connection.id).then(() => onClose());
  };

  const { accounts } = connection;
  return (
    <>
      <Header
        title={t('Connection setup')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={<DeleteButton onClick={handleDeleteClick} />}
      />
      <SideSheetBody>
        {accounts.map(account => (
          <ConnectionAccountCard account={account} onClick={handleClick} key={account.id} />
        ))}
      </SideSheetBody>

      <SideSheetMobile open={Boolean(account)}>
        {account && (
          <ConnectionAccountWindow connectionId={connection.id} account={account} onClose={() => setAccount(null)} />
        )}
      </SideSheetMobile>
    </>
  );
});
