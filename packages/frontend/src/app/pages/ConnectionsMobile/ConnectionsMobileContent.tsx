import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BackButton, Header } from '../../components/Header/Header';
import { Button, PlusIcon } from '@finex/ui-kit';
import { Container } from '../../components/Container/Container';
import { SelectionHeader } from '../../components/SectionHeader/SectionHeader';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';

import styles from './ConnectionsMobileContent.module.scss';

const t = getT('Connections');

export interface ConnectionsMobileContentProps {
  onClose: () => void;
}

export const ConnectionsMobileContent = observer<ConnectionsMobileContentProps>(({ onClose }) => {
  useEffect(() => {
    analytics.view({
      page_title: 'connections-mobile',
    });
  }, []);

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
              </>
            }
          >
            <Button size="sm" startIcon={<PlusIcon />}>
              {t('Connect bank')}
            </Button>
          </SelectionHeader>
        </Container>
      </SideSheetBody>
    </>
  );
});

export default ConnectionsMobileContent;
