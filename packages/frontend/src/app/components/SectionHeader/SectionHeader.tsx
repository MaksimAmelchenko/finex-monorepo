import React from 'react';
import clsx from 'clsx';

import styles from './SectionHeader.module.scss';

interface SelectionHeaderProps {
  title: string;
  supportText?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  isDivider?: boolean;
}
export function SelectionHeader({
  title,
  supportText,
  isDivider,
  children,
  className,
}: SelectionHeaderProps): JSX.Element {
  return (
    <header className={clsx(styles.root, className)}>
      <div className={styles.root__content}>
        <div className={styles.root__textAndSupportingText}>
          <h2 className={styles.root__text}>{title}</h2>
          {supportText && <div className={styles.root__supportingText}>{supportText}</div>}
        </div>
        {children && <div className={styles.root__actions}>{children}</div>}
      </div>
      {isDivider && <div className={styles.root__divider} />}
    </header>
  );
}
