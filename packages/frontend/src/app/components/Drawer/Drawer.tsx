import React, { ReactNode, useEffect } from 'react';
import MuiDrawer from '@mui/material/Drawer';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';

import { DrawerHeader } from './DrawerHeader';

import styles from './Drawer.module.scss';

interface IDrawerProps {
  title: string;
  isOpened: boolean;
  onClose: () => unknown;
  children: ReactNode;
  className?: string;
  onOpen?: () => void;
}

export function Drawer({ isOpened, title, onClose, children, onOpen, className }: IDrawerProps): JSX.Element {
  const theme = useTheme();

  useEffect(() => {
    if (isOpened) {
      window.setTimeout(() => {
        onOpen && onOpen();
      }, 100);
    }
  }, [isOpened, onOpen]);

  return (
    <MuiDrawer
      anchor="right"
      open={isOpened}
      sx={{
        // because the header has "drawer + 1" to override the left menu
        zIndex: theme.zIndex.drawer + 2,
      }}
    >
      <div className={clsx(styles.container, className)}>
        <DrawerHeader title={title} onClose={onClose} />
        <div className={styles.content}>{children}</div>
      </div>
    </MuiDrawer>
  );
}
