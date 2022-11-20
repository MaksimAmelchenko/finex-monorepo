import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';

import styles from './Drawer.module.scss';

interface IDrawerProps {
  isOpened: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ isOpened, children, className }: IDrawerProps): JSX.Element {
  const theme = useTheme();

  return (
    <MuiDrawer
      anchor="right"
      disableEscapeKeyDown={true}
      open={isOpened}
      sx={{
        // because the header has "drawer + 1" to override the left menu
        zIndex: theme.zIndex.drawer + 2,
      }}
    >
      <div className={clsx(styles.container, className)}>{isOpened && <>{children}</>}</div>
    </MuiDrawer>
  );
}
