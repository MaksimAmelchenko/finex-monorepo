import React from 'react';
import clsx from 'clsx';

import styles from './EmptyState.module.scss';

export interface EmptyStateProps {
  illustration: React.ReactNode;
  text?: string;
  supportingText?: string;
  children?: React.ReactNode;
  className?: string;
}


export function EmptyState({ illustration, text, supportingText, children, className }: EmptyStateProps): JSX.Element {
  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.content}>
        <div className={styles.content__illustration}>{illustration}</div>
        <div className={styles.content__description}>
          <div className={styles.content__text}>{text}</div>
          {supportingText && <div className={styles.content__supportingText}>{supportingText}</div>}
        </div>
      </div>
      {children && <div className={styles.root_actions}>{children}</div>}
    </div>
  );
}
