import React from 'react';

export interface HeaderLayoutProps {
  title: string;
  subtitle?: string;
}

import styles from './HeaderLayout.module.scss';

export function HeaderLayout({ title, subtitle }: HeaderLayoutProps): JSX.Element {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
