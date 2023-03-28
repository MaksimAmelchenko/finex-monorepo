import React from 'react';

import { ProfileMobileContentLazy } from './ProfileMobileContentLazy';
import { ProfileMobileContentProps } from './ProfileMobileContent';
import { SideSheetMobile } from '../../components/SideSheetMobile/SideSheetMobile';

interface ProfileMobileProps extends ProfileMobileContentProps {
  open: boolean;
}

export function ProfileMobile({ open, onClose }: ProfileMobileProps): JSX.Element {
  return (
    <SideSheetMobile open={open}>
      <ProfileMobileContentLazy onClose={onClose} />
    </SideSheetMobile>
  );
}
