import React from 'react';

import { CategoriesMobileContentLazy } from './CategoriesMobileContentLazy';
import { CategoriesMobileContentProps } from './CategoriesMobileContent';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';

interface CategoriesMobileProps extends CategoriesMobileContentProps {
  open: boolean;
}

export function CategoriesMobile({ open, onSelect, onClose }: CategoriesMobileProps): JSX.Element {
  return (
    <SideSheetMobile open={open}>
      <CategoriesMobileContentLazy onSelect={onSelect} onClose={onClose} />
    </SideSheetMobile>
  );
}
