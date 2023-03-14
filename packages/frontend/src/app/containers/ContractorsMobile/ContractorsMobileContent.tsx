import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BackButton, Header } from '../../components/Header/Header';
import { Contractor } from '../../stores/models/contractor';
import { ContractorRow } from './ContractorRow/ContractorRow';
import { ContractorsRepository } from '../../stores/contractors-repository';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';
import { analytics } from '../../lib/analytics';

const t = getT('ContractorsMobile');

export interface ContractorsMobileContentProps {
  onSelect?: (contractor: Contractor) => void;
  onClose: () => void;
}

export const ContractorsMobileContent = observer<ContractorsMobileContentProps>(({ onSelect, onClose }) => {
  const contractorsRepository = useStore(ContractorsRepository);
  const { contractors } = contractorsRepository;
  const isSelectMode = Boolean(onSelect);

  useEffect(() => {
    analytics.view({
      page_title: 'contractors-mobile',
    });
  }, []);

  const handleClick = useCallback(
    (contractor: Contractor, event: React.MouseEvent<HTMLButtonElement>) => {
      if (isSelectMode) {
        onSelect?.(contractor);
      }
    },
    [isSelectMode, onSelect]
  );

  return (
    <>
      <Header title={t('Contractors')} startAdornment={<BackButton onClick={onClose} />} />
      <SideSheetBody>
        {contractors
          // .filter(({ isEnabled }) => !isSelectMode || (isSelectMode && isEnabled))
          .map(contractor => {
            return <ContractorRow contractor={contractor} onClick={handleClick} key={contractor.id} />;
          })}
      </SideSheetBody>
    </>
  );
});

export default ContractorsMobileContent;
