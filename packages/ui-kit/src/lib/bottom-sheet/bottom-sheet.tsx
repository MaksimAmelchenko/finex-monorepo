import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import clsx from 'clsx';

import styles from './bottom-sheet.module.scss';

export interface BottomSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
}

export function BottomSheet({ open, children, onClose, className }: BottomSheetProps) {
  return (
    <MuiDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      keepMounted
      PaperProps={{
        sx: {
          borderTopLeftRadius: '0.8rem',
          borderTopRightRadius: '0.8rem',
        },
      }}
    >
      <div className={clsx(styles.container, className)}>{children}</div>
    </MuiDrawer>
  );
}
