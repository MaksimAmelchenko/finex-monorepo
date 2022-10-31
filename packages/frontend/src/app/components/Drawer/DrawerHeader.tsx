import React from 'react';

import { XmarkIcon, IconButton } from '@finex/ui-kit';

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
        <XmarkIcon />
      </IconButton>
    </header>
  );
}
