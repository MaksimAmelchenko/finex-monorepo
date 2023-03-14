import React from 'react';

import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';
import { TagsMobileContentLazy } from './TagsMobileContentLazy';
import { TagsMobileContentProps } from './TagsMobileContent';

interface TagMobileProps extends TagsMobileContentProps {
  open: boolean;
}

export function TagsMobile({ open, onSelect, onClose }: TagMobileProps): JSX.Element {
  return (
    <SideSheetMobile open={open}>
      <TagsMobileContentLazy onSelect={onSelect} onClose={onClose} />
    </SideSheetMobile>
  );
}
