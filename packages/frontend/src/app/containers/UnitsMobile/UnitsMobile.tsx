import React from 'react';

import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { UnitsMobileContentLazy } from './UnitsMobileContentLazy';
import { UnitsMobileContentProps } from './UnitsMobileContent';

interface UnitMobileProps extends UnitsMobileContentProps {
  open: boolean;
}

export function UnitsMobile({ open, onSelect, onClose }: UnitMobileProps): JSX.Element {
  return (
    <SideSheetMobile open={open}>
      <UnitsMobileContentLazy onSelect={onSelect} onClose={onClose} />
    </SideSheetMobile>
  );
}
