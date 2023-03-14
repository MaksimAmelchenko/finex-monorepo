import React from 'react';

import { MoneysMobileContentLazy } from './MoneysMobileContentLazy';
import { MoneysMobileContentProps } from './MoneysMobileContent';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';

interface MoneyMobileProps extends MoneysMobileContentProps {
  open: boolean;
}

export function MoneysMobile({ open, onSelect, onClose }: MoneyMobileProps): JSX.Element {
  return (
    <SideSheetMobile open={open}>
      <MoneysMobileContentLazy onSelect={onSelect} onClose={onClose} />
    </SideSheetMobile>
  );
}
