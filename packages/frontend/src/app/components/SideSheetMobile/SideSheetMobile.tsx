import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import { observer } from 'mobx-react-lite';

import { Loader } from '../Loader/Loader';

export interface SideSheetMobileProps {
  open: boolean;
  children: React.ReactNode;
}

export const SideSheetMobile = observer<SideSheetMobileProps>(({ open, children }) => {
  return (
    <MuiDrawer anchor="right" open={open} PaperProps={{ sx: { width: '100vw' } }}>
      <React.Suspense fallback={<Loader />}>
        {/**/}
        {open && <> {children} </>}
      </React.Suspense>
    </MuiDrawer>
  );
});
