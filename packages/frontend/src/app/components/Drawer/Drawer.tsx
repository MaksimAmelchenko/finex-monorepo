import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import clsx from 'clsx';

import styles from './Drawer.module.scss';

interface DrawerProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ open, children, className }: DrawerProps): JSX.Element {
  return (
    <MuiDrawer anchor="right" disableEscapeKeyDown={true} open={open}>
      <div className={clsx(styles.container, className)}>{open && <>{children}</>}</div>
    </MuiDrawer>
  );
}
