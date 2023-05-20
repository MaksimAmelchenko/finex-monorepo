import React from 'react';

import { BillingMobileContentLazy } from './BillingMobileContentLazy';
import { BillingMobileContentProps } from './BillingMobileContent';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';

interface ConnectionsMobileProps extends BillingMobileContentProps {
  open: boolean;
}

export function BillingMobile({ open, onClose }: ConnectionsMobileProps): JSX.Element {
  return (
    <SideSheetMobile open={open}>
      <BillingMobileContentLazy onClose={onClose} />
    </SideSheetMobile>
  );
}
