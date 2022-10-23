import React from 'react';
import clsx from 'clsx';

export interface HeaderLayoutProps {
  title: string;
  subtitle?: string;
  className?: string;
}

import styles from './HeaderLayout.module.scss';

export function HeaderLayout({ title, subtitle, className }: HeaderLayoutProps): JSX.Element {
  return (
    <header className={clsx(styles.header, className)}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
