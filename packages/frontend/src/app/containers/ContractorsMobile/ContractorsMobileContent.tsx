import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { AddButton, BackButton, Header } from '../../components/Header/Header';
import { Building02Icon, Button, PlusIcon } from '@finex/ui-kit';
import { Contractor } from '../../stores/models/contractor';
import { ContractorRow } from './ContractorRow/ContractorRow';
import { ContractorWindowMobile } from '../ContractorWindowMobile/ContractorWindowMobile';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IContractor } from '../../types/contractor';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './ContractorsMobileContent.module.scss';

const t = getT('ContractorsMobile');

export interface ContractorsMobileContentProps {
  onSelect?: (contractor: Contractor) => void;
  onClose: () => void;
}

export const ContractorsMobileContent = observer<ContractorsMobileContentProps>(({ onSelect, onClose }) => {
  const contractorsRepository = useStore(ContractorsRepository);
  const [contractor, setContractor] = useState<Partial<IContractor> | Contractor | null>(null);

  const { contractors } = contractorsRepository;
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'contractors-mobile',
    });
  }, []);

  const handleAddClick = useCallback(() => {
    setContractor({});
  }, []);

  const handleClick = useCallback(
    (contractor: Contractor, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(contractor);
      } else {
        setContractor(contractor);
      }
    },
    [isSelectMode, onSelect]
  );

  function renderContent(): JSX.Element {
    if (!contractors.length) {
      return (
        <div className={styles.root__emptyState}>
          <EmptyState
            illustration={<Building02Icon className={styles.root__emptyStateIllustration} />}
            text={t('You do not have contractors yet')}
            supportingText={t('Start creating by clicking on\u00A0"Create\u00A0contractor"')}
          >
            <Button size="sm" startIcon={<PlusIcon />} onClick={handleAddClick}>
              {t('Create contractor')}
            </Button>
          </EmptyState>
        </div>
      );
    }

    return (
      <>
        {contractors.map(contractor => (
          <ContractorRow contractor={contractor} onClick={handleClick} key={contractor.id} />
        ))}
      </>
    );
  }

  return (
    <>
      <Header
        title={t('Contractors')}
        startAdornment={<BackButton onClick={onClose} />}
        endAdornment={<AddButton onClick={handleAddClick} />}
      />
      <SideSheetBody>{renderContent()}</SideSheetBody>

      <SideSheetMobile open={Boolean(contractor)}>
        {contractor && <ContractorWindowMobile contractor={contractor} onClose={() => setContractor(null)} />}
      </SideSheetMobile>
    </>
  );
});

export default ContractorsMobileContent;
