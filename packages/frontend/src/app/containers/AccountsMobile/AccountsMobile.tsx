import React from 'react';

import { AccountsMobileContentLazy } from './AccountsMobileContentLazy';
import { AccountsMobileContentProps } from './AccountsMobileContent';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';

interface AccountMobileProps extends AccountsMobileContentProps {
  open: boolean;
}

export function AccountsMobile({ open, onSelect, onClose }: AccountMobileProps): JSX.Element {

  return (
    <SideSheetMobile open={open}>
      <AccountsMobileContentLazy onSelect={onSelect} onClose={onClose} />
    </SideSheetMobile>
  );
}
