import React, { ReactNode } from 'react';
import clsx from 'clsx';

import styles from './DrawerFooter.module.scss';

interface DrawerFooterProps {
  children: ReactNode;
  className?: string;
}

export function DrawerFooter({ children, className }: DrawerFooterProps): JSX.Element {
  return <footer className={clsx(styles.footer, className)}>{children}</footer>;
}
