import React from 'react';
import clsx from 'clsx';

import { CloseIcon } from '../icons';

import styles from './tag.module.scss';

export interface TagProps {
  children: string;
  className?: string;
  onClose?: () => void;
  size?: 'small' | 'medium'; // The size of the component.
}

export function Tag({ size = 'medium', children, className, onClose }: TagProps): JSX.Element {
  return (
    <div className={clsx(styles.tag, className, styles[`tag_size_${size}`], onClose && styles.tag_withCloseButton)}>
      <div className={styles.tag__label} title={children}>
        {children}
      </div>
      {onClose && (
        <button className={styles.tag__closeButton} role="button" onClick={onClose}>
          <CloseIcon className={styles.tag__closeIcon} />
        </button>
      )}
    </div>
  );
}
