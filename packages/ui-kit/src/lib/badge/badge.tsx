import React from 'react';
import clsx from 'clsx';

import { XCloseIcon } from '../icons';

import styles from './badge.module.scss';

export interface BadgeProps {
  size?: 'md';
  children: string;
  onClose?: () => void;
  className?: string;
}

export function Badge({ size = 'md', children, className, onClose }: BadgeProps): JSX.Element {
  return (
    <div className={clsx(styles.root, className, styles[`root_size_${size}`], onClose && styles.root_withCloseButton)}>
      <div className={styles.root__label} title={children}>
        {children}
      </div>
      {onClose && (
        <button type="button" className={styles.root__closeButton} role="button" onClick={onClose}>
          <XCloseIcon className={styles.root__closeIcon} />
        </button>
      )}
    </div>
  );
}
