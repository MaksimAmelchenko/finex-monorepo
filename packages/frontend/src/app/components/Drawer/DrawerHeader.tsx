import React from 'react';

import { XCloseIcon, IconButton } from '@finex/ui-kit';

import styles from './DrawerHeader.module.scss';

interface DrawerHeaderProps {
  title: string;
  onClose: () => unknown;
}

export function DrawerHeader({ title, onClose }: DrawerHeaderProps): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.header__title}>{title}</div>
      <IconButton onClick={onClose} className={styles.header__closeButton}>
        <XCloseIcon />
      </IconButton>
    </header>
  );
}
