import React from 'react';
import clsx from 'clsx';

import { XmarkIcon } from '../icons';

import styles from './tag.module.scss';

export interface TagProps {
  size?: 'md' | 'lg';
  color?: 'primary' | 'gray';
  outline?: boolean;
  children: string;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function Tag({
  size = 'md',
  outline = true,
  color = 'primary',
  children,
  className,
  onClose,
}: TagProps): JSX.Element {
  return (
    <div
      className={clsx(
        styles.root,
        className,
        styles[`root_size_${size}`],
        styles[`root_color_${color}`],
        outline && styles.root_outlined,
        onClose && styles.root_withCloseButton
      )}
    >
      <div className={styles.root__label} title={children}>
        {children}
      </div>
      {onClose && (
        <button type="button" className={styles.root__closeButton} onClick={onClose}>
          <XmarkIcon />
        </button>
      )}
    </div>
  );
}
