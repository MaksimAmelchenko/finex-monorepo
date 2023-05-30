import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { AddConnectionWindow } from './AddConnectionWindow/AddConnectionWindow';
import { BackButton, Header } from '../../components/Header/Header';
import { Button, Checkbox, PlusIcon } from '@finex/ui-kit';
import { ConnectionsRepository } from '../../stores/connections-repository';
import { Container } from '../../components/Container/Container';
import { InstitutionCard } from './InstitutionCard/InstitutionCard';
import { SelectionHeader } from '../../components/SectionHeader/SectionHeader';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './ConnectionsMobileContent.module.scss';
import { AppStore } from '../../stores/app-store';
import { ConnectionWindow } from './ConnectionWindow/ConnectionWindow';

const t = getT('Connections');

export interface ConnectionsMobileContentProps {
  onClose: () => void;
}

export const ConnectionsMobileContent = observer<ConnectionsMobileContentProps>(({ onClose }) => {
  const connectionsRepository = useStore(ConnectionsRepository);
  const appStore = useStore(AppStore);
  const [isRetrieveMaxPeriodTransactions, setIsRetrieveMaxPeriodTransactions] = useState<boolean>(true);

  const [connectionId, setConnectionId] = useState<string | null>(
    appStore.settingSideSheetParams?.connectionId ?? null
  );

  useEffect(() => {
    appStore.clearSettingSideSheetParams();
  }, [appStore]);

  const connection = connectionsRepository.connections.find(connection => connection.id === connectionId);

  const [isOpenedAddConnectionWindow, setIsOpenedAddConnectionWindow] = useState<boolean>(false);

  useEffect(() => {
    analytics.view({
      page_title: 'connections-mobile',
    });
  }, []);

  useEffect(() => {
    connectionsRepository.getConnections();
  }, [connectionsRepository]);

  const { connections } = connectionsRepository;

  return (
    <>
      <Header title={t('Bank connections')} startAdornment={<BackButton onClick={onClose} />} />
      <SideSheetBody className={styles.main}>
        <Container>
          <SelectionHeader
            title={t('Banking connection management')}
            supportText={
              <>
                <p>
                  {t('Synchronize transactions with your bank accounts for automatic accounting of your finances.')}
                </p>
                <p>
                  {t(
                    'Your data is safe. We do not store your logins and passwords, we only have access to read data and cannot make payments on your behalf. You can revoke permission to access your data at any time.'
                  )}
                </p>
                <br />

                <Checkbox
                  size="md"
                  value={isRetrieveMaxPeriodTransactions}
                  onChange={setIsRetrieveMaxPeriodTransactions}
                >
                  {t('Retrieve my transactions for the maximum available period')}
                </Checkbox>
              </>
            }
          >
            <Button size="sm" startIcon={<PlusIcon />} onClick={() => setIsOpenedAddConnectionWindow(true)}>
              {t('Connect bank')}
            </Button>
          </SelectionHeader>
        </Container>

        <div>
          {connections.map(connection => (
            <InstitutionCard
              id={connection.id}
              logo={connection.institutionLogo}
              name={connection.institutionName}
              onClick={() => setConnectionId(connection.id)}
              key={connection.id}
            />
          ))}
        </div>
      </SideSheetBody>

      <SideSheetMobile open={isOpenedAddConnectionWindow}>
        <AddConnectionWindow
          isRetrieveMaxPeriodTransactions={isRetrieveMaxPeriodTransactions}
          onClose={() => setIsOpenedAddConnectionWindow(false)}
        />
      </SideSheetMobile>

      <SideSheetMobile open={Boolean(connection)}>
        {connection && <ConnectionWindow connection={connection} onClose={() => setConnectionId(null)} />}
      </SideSheetMobile>
    </>
  );
});

export default ConnectionsMobileContent;
