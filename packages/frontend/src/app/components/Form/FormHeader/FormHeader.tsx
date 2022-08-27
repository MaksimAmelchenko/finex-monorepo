import React from 'react';

import { CloseIcon, IconButton } from '@finex/ui-kit';

import styles from './FormHeader.module.scss';

interface DrawerHeaderProps {
  title: string;
  onClose: () => unknown;
}

export function FormHeader({ title, onClose }: DrawerHeaderProps): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.header__title}>{title}</div>
      <IconButton onClick={onClose} className={styles.header__closeButton}>
        <CloseIcon />
      </IconButton>
    </header>
  );
}
