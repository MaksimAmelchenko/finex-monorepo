import React from 'react';

import { ContractorsMobileContentLazy } from './ContractorsMobileContentLazy';
import { ContractorsMobileContentProps } from './ContractorsMobileContent';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';

interface ContractorMobileProps extends ContractorsMobileContentProps {
  open: boolean;
}

export function ContractorsMobile({ open, onSelect, onClose }: ContractorMobileProps): JSX.Element {
  return (
    <SideSheetMobile open={open}>
      <ContractorsMobileContentLazy onSelect={onSelect} onClose={onClose} />
    </SideSheetMobile>
  );
}
