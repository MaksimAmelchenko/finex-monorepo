import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import clsx from 'clsx';

import styles from './Drawer.module.scss';

interface IDrawerProps {
  isOpened: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ isOpened, children, className }: IDrawerProps): JSX.Element {
  return (
    <MuiDrawer anchor="right" disableEscapeKeyDown={true} open={isOpened}>
      <div className={clsx(styles.container, className)}>{isOpened && <>{children}</>}</div>
    </MuiDrawer>
  );
}
