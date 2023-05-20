import React from 'react';

import { ConnectionsMobileContentLazy } from './ConnectionsMobileContentLazy';
import { ConnectionsMobileContentProps } from './ConnectionsMobileContent';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';

interface ConnectionsMobileProps extends ConnectionsMobileContentProps {
  open: boolean;
}

export function ConnectionsMobile({ open, onClose }: ConnectionsMobileProps): JSX.Element {
  return (
    <SideSheetMobile open={open}>
      <ConnectionsMobileContentLazy onClose={onClose} />
    </SideSheetMobile>
  );
}
