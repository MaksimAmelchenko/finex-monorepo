import React from 'react';
import clsx from 'clsx';

import styles from './HeaderLayout.module.scss';

export interface HeaderLayoutProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function HeaderLayout({ title, subtitle, className, ...rest }: HeaderLayoutProps): JSX.Element {
  return (
    <header className={clsx(styles.header, className)} {...rest}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
