import React from 'react';

import { ProjectsMobileContentLazy } from './ProjectsMobileContentLazy';
import { ProjectsMobileContentProps } from './ProjectsMobileContent';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';

interface ProjectMobileProps extends ProjectsMobileContentProps {
  open: boolean;
}

export function ProjectsMobile({ open, onSelect, onClose }: ProjectMobileProps): JSX.Element {
  return (
    <SideSheetMobile open={open}>
      <ProjectsMobileContentLazy onSelect={onSelect} onClose={onClose} />
    </SideSheetMobile>
  );
}
